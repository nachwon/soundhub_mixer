import { ChannelDto, MixerController } from "../types";
import { BufferExtractor } from "../utils";
import Channel from "./channel";
import { MasterChannelGainController, MasterGainController } from "./gainControllers";
import { ControllerMap, DefaultMixerController } from "./mixerControllers";


class Mixer {
  // Context
  audioCtx: AudioContext;

  // Channels
  channels: Array<Channel> = [];

  // Time
  startTime: number = 0;
  offsetTime: number = 0;

  // States
  isPlaying: boolean = false;
  state: 'running' | 'suspended' | 'stopped' | 'closed' = 'stopped';
  controller: MixerController = new DefaultMixerController(this);

  // Nodes
  masterGainNode: GainNode;
  splitterNode: ChannelSplitterNode;
  analyserNodeL: AnalyserNode;
  analyserNodeR: AnalyserNode;

  // Controllers
  gainController: MasterGainController;
  masterChannelGainController: MasterChannelGainController;

  constructor() {
    this.audioCtx = new AudioContext();
    this.masterGainNode = this.audioCtx.createGain();
    this.splitterNode = this.audioCtx.createChannelSplitter(2);
    this.analyserNodeL = this.audioCtx.createAnalyser();
    this.analyserNodeR = this.audioCtx.createAnalyser();

    this.gainController = new MasterGainController(this.masterGainNode)
    this.masterChannelGainController = new MasterChannelGainController()

    this.connectNodes()
    this.setMixerState('stopped')
  }

  private connectNodes() {
    this.masterGainNode.connect(this.splitterNode);
    this.splitterNode.connect(this.analyserNodeL, 0);
    this.splitterNode.connect(this.analyserNodeR, 1);
    this.masterGainNode.connect(this.audioCtx.destination);
  }

  get channelsCount() {
    return this.channels.length
  }

  get channelsLoaded() {
    return this.channels.every((channel) => channel.loaded)
  }

  get currentDuration(): number {
    if (this.state === 'stopped' || this.duration === 0) {
      return 0
    }
    return Math.min(this.offsetTime + (this.timeElapsed), this.duration)
  }

  get timeElapsed(): number {
    return this.audioCtx.currentTime - this.startTime
  }

  get duration(): number {
    const maxChannel = this.channels.reduce((prevChannel, currentChannel) =>
      prevChannel.duration < currentChannel.duration ?
        currentChannel :
        prevChannel
      , { duration: 0 })
    return maxChannel.duration
  }

  async addChannel(dto: ChannelDto) {
    if (this.state !== 'stopped') {
      return
    }

    const channelConstructor = new BufferExtractor()
    const buffer = await channelConstructor.extract(dto.src)
    if (!buffer) {
      return
    }

    const channel = new Channel(buffer, this.audioCtx, { channelIndex: this.channelsCount, src: dto.src, title: dto.title })
    this.channels.push(channel);
    this.connectControllers(channel);
    channel.connect(this.masterGainNode);
  }

  private connectControllers(channel: Channel) {
    channel.gainController.connectSetController(this.masterChannelGainController)
  }

  play(offset: number = 0) {
    const startTime = this.audioCtx.currentTime
    if (this.controller.play(startTime, offset)) {
      this.setMixerState('running')
      this.isPlaying = true;
      this.startTime = startTime;
      this.offsetTime = offset;
    }
  }

  stop() {
    if (this.controller.stop()) {
      this.setMixerState('stopped')
      this.isPlaying = false;
      this.startTime = 0
      this.offsetTime = 0
    }
  }

  pause() {
    if (this.controller.pause()) {
      this.setMixerState('suspended')
      this.isPlaying = false;
    }
  }

  seek(offset: number) {
    const startTime = this.audioCtx.currentTime
    if (this.controller.seek(startTime, offset)) {
      this.isPlaying = true;
      this.startTime = startTime
      this.offsetTime = offset;
    }
  }

  private setMixerState(state: 'running' | 'suspended' | 'stopped' | 'closed') {
    this.state = state;
    const controller = ControllerMap[state]
    if (controller) {
      this.controller = new controller(this)
    }
  }
}

export default Mixer;
