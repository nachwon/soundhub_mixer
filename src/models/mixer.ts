import { ChannelDto, MixerController } from "../types";
import { BufferExtractor } from "../utils";
import { SoloGainBroadcaster } from "./addons";
import { ControllerMap, DefaultMixerController } from "./mixerControllers";
import { Channel, MasterChannel } from "./channels";
import { MaxChannelCount } from "../constants";

class Mixer {
  // Context
  audioCtx: AudioContext;

  // Channels
  maxChannelCount: number = MaxChannelCount;
  masterChannel: MasterChannel;
  #channels: Array<Channel> = [];

  // Time
  #startTime: number = 0;
  #offsetTime: number = 0;
  #elapsedTime: number = 0;

  // States
  #isPlaying: boolean = false;
  #state: "running" | "suspended" | "stopped" | "closed" = "stopped";
  #mixerController: MixerController = new DefaultMixerController(this);

  // Controllers
  soloGainBroadcaster: SoloGainBroadcaster;

  get isPlaying() {
    return this.#isPlaying;
  }

  get channels() {
    return this.#channels;
  }

  get currentTime() {
    return this.audioCtx.currentTime;
  }

  constructor() {
    console.log("INIT!!!");
    this.setMixerState("stopped");
    this.audioCtx = new AudioContext();

    this.masterChannel = new MasterChannel(this.audioCtx, this);
    this.masterChannel.connect();

    this.soloGainBroadcaster = new SoloGainBroadcaster();
  }

  private setMixerState(state: "running" | "suspended" | "stopped" | "closed") {
    this.#state = state;
    const controller = ControllerMap[state];
    if (controller) {
      this.#mixerController = new controller(this);
    }
  }

  get channelsCount() {
    return this.#channels.length;
  }

  get channelsLoaded() {
    return this.#channels.every((channel) => channel.loaded);
  }

  get currentDuration(): number {
    if (this.#state === "stopped" || this.duration === 0) {
      return 0;
    }
    return Math.min(this.#offsetTime + this.timeElapsed, this.duration);
  }

  get timeElapsed(): number {
    return this.audioCtx.currentTime - this.#startTime;
  }

  get elapsedTime(): number {
    return this.#elapsedTime;
  }

  set elapsedTime(when: number) {
    this.#elapsedTime = when;
  }

  get duration(): number {
    const maxChannel = this.#channels.reduce(
      (prevChannel, currentChannel) => (prevChannel.duration < currentChannel.duration ? currentChannel : prevChannel),
      { duration: 0 }
    );
    return maxChannel.duration;
  }

  async addChannel(dto: ChannelDto) {
    if (this.#state !== "stopped") {
      return;
    }

    const channelConstructor = new BufferExtractor();
    const buffer = await channelConstructor.extract(dto.src);
    if (!buffer) {
      return;
    }

    const channel = new Channel(buffer, this.audioCtx, this.masterChannel.node, {
      index: this.channelsCount,
      src: dto.src,
      title: dto.title,
    });

    this.#channels.push(channel);
    this.soloGainBroadcaster.add(channel.gainController);
  }

  play(offset: number = 0) {
    const startTime = this.audioCtx.currentTime;
    if (this.#mixerController.play(startTime, offset)) {
      this.setMixerState("running");
      this.#isPlaying = true;
      this.#startTime = startTime;
      this.#offsetTime = offset;
    }
  }

  stop() {
    this.#elapsedTime = 0;
    if (this.#mixerController.stop()) {
      this.setMixerState("stopped");
      this.#isPlaying = false;
      this.#startTime = 0;
      this.#offsetTime = 0;
    }
  }

  pause() {
    if (this.#mixerController.stop()) {
      this.setMixerState("stopped");
      this.#isPlaying = false;
      this.#elapsedTime = this.#elapsedTime + this.timeElapsed;
    }
  }

  playToggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play(this.#elapsedTime);
    }
  }

  seek(offset: number) {
    const startTime = this.audioCtx.currentTime;
    if (this.#mixerController.seek(startTime, offset)) {
      this.#isPlaying = true;
      this.#startTime = startTime;
      this.#offsetTime = offset;
      this.#elapsedTime = offset;
    }
  }

  setMasterGain(value: number, when: number = 0) {
    this.masterChannel.setGain(value, when);
  }
}

export default Mixer;
