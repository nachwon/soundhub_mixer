import { ChannelDto, MixerController } from "../types";
import Channel, { BufferExtractor } from "./channel";
import { ControllerMap, DefaultMixerController } from "./mixerControllers";


class Mixer {
  // Context
  audioCtx: AudioContext;

  // Channels
  channels: Array<Channel> = [];

  // States
  isPlaying: boolean = false;
  state: 'running' | 'suspended' | 'stopped' | 'closed' = 'stopped';
  controller: MixerController = new DefaultMixerController(this);

  // Nodes
  masterGainNode: GainNode;
  splitterNode: ChannelSplitterNode;
  analyserNodeL: AnalyserNode;
  analyserNodeR: AnalyserNode;

  constructor() {
    this.audioCtx = new AudioContext();
    this.masterGainNode = this.audioCtx.createGain();
    this.splitterNode = this.audioCtx.createChannelSplitter(2);
    this.analyserNodeL = this.audioCtx.createAnalyser();
    this.analyserNodeR = this.audioCtx.createAnalyser();

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
    channel.connect(this.masterGainNode);
  }

  play() {
    if (this.controller.play(this.audioCtx.currentTime + 1)) {
      this.setMixerState('running')
      this.isPlaying = true;
    }
  }

  stop() {
    if (this.controller.stop()) {
      this.setMixerState('stopped')
      this.isPlaying = false;
    }
  }

  pause() {
    if (this.controller.pause()) {
      this.setMixerState('suspended')
      this.isPlaying = false;
    }
  }

  seek(offset: number) {
    if (this.controller.seek(offset)) {
      this.setMixerState('running')
      this.isPlaying = true;
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
