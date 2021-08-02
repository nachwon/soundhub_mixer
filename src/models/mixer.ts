import { ChannelDto, MixerController } from "../types";
import { BufferExtractor } from "../utils";
import Channel from "./channel";
import { SoloGainBroadcaster, MasterGainController, AudioAnalyser } from "./addons";
import { ControllerMap, DefaultMixerController } from "./mixerControllers";


class Mixer {
  // Context
  audioCtx: AudioContext;

  // Channels
  channels: Array<Channel> = [];

  // Time
  #startTime: number = 0;
  #offsetTime: number = 0;

  // States
  #isPlaying: boolean = false;
  #state: 'running' | 'suspended' | 'stopped' | 'closed' = 'stopped';
  #mixerController: MixerController = new DefaultMixerController(this);

  get isPlaying() { return this.#isPlaying }

  // Nodes
  #masterGainNode: GainNode;

  // Controllers
  gainController: MasterGainController;
  soloGainBroadcaster: SoloGainBroadcaster;
  analyser: AudioAnalyser;

  constructor() {
    this.setMixerState('stopped')
    this.audioCtx = new AudioContext();
    this.#masterGainNode = this.audioCtx.createGain();

    this.gainController = new MasterGainController(this.#masterGainNode)
    this.soloGainBroadcaster = new SoloGainBroadcaster()
    this.analyser = new AudioAnalyser(this.audioCtx);

    this.connectNodes()
  }

  private connectNodes() {
    this.analyser.connect(this.#masterGainNode)
    this.#masterGainNode.connect(this.audioCtx.destination);
  }

  private setMixerState(state: 'running' | 'suspended' | 'stopped' | 'closed') {
    this.#state = state;
    const controller = ControllerMap[state]
    if (controller) {
      this.#mixerController = new controller(this)
    }
  }

  get channelsCount() {
    return this.channels.length
  }

  get channelsLoaded() {
    return this.channels.every((channel) => channel.loaded)
  }

  get currentDuration(): number {
    if (this.#state === 'stopped' || this.duration === 0) {
      return 0
    }
    return Math.min(this.#offsetTime + (this.timeElapsed), this.duration)
  }

  get timeElapsed(): number {
    return this.audioCtx.currentTime - this.#startTime
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
    if (this.#state !== 'stopped') {
      return
    }

    const channelConstructor = new BufferExtractor()
    const buffer = await channelConstructor.extract(dto.src)
    if (!buffer) {
      return
    }

    const channel = new Channel(
      buffer,
      this.audioCtx,
      this.#masterGainNode,
      {
        index: this.channelsCount,
        src: dto.src,
        title: dto.title
      }
    )
    
    this.channels.push(channel);
    this.soloGainBroadcaster.add(channel.gainController)
  }

  play(offset: number = 0) {
    const startTime = this.audioCtx.currentTime
    if (this.#mixerController.play(startTime, offset)) {
      this.setMixerState('running')
      this.#isPlaying = true;
      this.#startTime = startTime;
      this.#offsetTime = offset;
    }
  }

  stop() {
    if (this.#mixerController.stop()) {
      this.setMixerState('stopped')
      this.#isPlaying = false;
      this.#startTime = 0
      this.#offsetTime = 0
    }
  }

  pause() {
    if (this.#mixerController.pause()) {
      this.setMixerState('suspended')
      this.#isPlaying = false;
    }
  }

  seek(offset: number) {
    const startTime = this.audioCtx.currentTime
    if (this.#mixerController.seek(startTime, offset)) {
      this.#isPlaying = true;
      this.#startTime = startTime
      this.#offsetTime = offset;
    }
  }
}

export default Mixer;
