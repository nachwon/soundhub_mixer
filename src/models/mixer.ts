import { ChannelDto, MixerController, MixerSettings } from "../types";
import { BufferExtractor } from "../utils";
import { SoloGainBroadcaster } from "./addons";
import { ControllerMap, DefaultMixerController } from "./mixerControllers";
import { Channel, MasterChannel } from "./channels";
import { MaxChannelCount } from "../constants";
import { makeAutoObservable } from "mobx";

class Mixer {
  // Context
  audioCtx: AudioContext;

  // Channels
  maxChannelCount: number = MaxChannelCount;
  masterChannel: MasterChannel;
  channels: Array<Channel | undefined> = new Array(8);

  // Time
  startTime: number = 0;
  offsetTime: number = 0;
  elapsedTime: number = 0;

  // States
  isPlaying: boolean = false;
  state: "running" | "suspended" | "stopped" | "closed" = "stopped";
  mixerController: MixerController = new DefaultMixerController(this);

  // Controllers
  soloGainBroadcaster: SoloGainBroadcaster;

  get currentTime() {
    return this.audioCtx.currentTime;
  }

  constructor() {
    makeAutoObservable(this);
    this.channels = [];
    for (let i = 0; i < this.maxChannelCount; i++) {
      this.channels.push(undefined);
    }
    this.setMixerState("stopped");
    this.audioCtx = new AudioContext();

    this.masterChannel = new MasterChannel(this.audioCtx, this);
    this.masterChannel.connect();

    this.soloGainBroadcaster = new SoloGainBroadcaster();
  }

  private setMixerState(state: "running" | "suspended" | "stopped" | "closed") {
    this.state = state;
    const controller = ControllerMap[state];
    if (controller) {
      this.mixerController = new controller(this);
    }
  }

  get channelsLoaded() {
    if (this.channels.every((value) => value === undefined)) {
      return false;
    }

    const loaded = [];
    for (let channel of this.channels) {
      if (channel) {
        loaded.push(channel.loaded);
      }
    }
    return loaded.every((value) => value);
  }

  getCurrentDuration(): number {
    if (this.state === "stopped" || this.duration === 0) {
      return 0;
    }
    return Math.min(this.offsetTime + this.timeElapsed, this.duration);
  }

  get timeElapsed(): number {
    return this.audioCtx.currentTime - this.startTime;
  }

  get duration(): number {
    let maxDuration = 0;
    for (let channel of this.channels) {
      if (channel) {
        maxDuration = Math.max(maxDuration, channel.duration);
      }
    }
    return maxDuration;
  }

  async addChannel(index: number, dto: ChannelDto) {
    if (this.state === "running") {
      return;
    }

    const channelConstructor = new BufferExtractor();
    const buffer = await channelConstructor.extract(dto.src);
    if (!buffer) {
      return;
    }

    const channel = new Channel(buffer, this.audioCtx, this.masterChannel.node, {
      index: index,
      src: dto.src,
      title: dto.title,
    });

    this.insertChannel(index, channel);
    this.soloGainBroadcaster.add(channel.gainController);
  }

  private insertChannel(index: number, channel: Channel) {
    this.channels.splice(index, 1, channel);
  }

  play(offset: number = 0) {
    const startTime = this.audioCtx.currentTime;
    if (this.mixerController.play(startTime, offset)) {
      this.setMixerState("running");
      this.isPlaying = true;
      this.startTime = startTime;
      this.offsetTime = offset;
    }
  }

  stop() {
    this.elapsedTime = 0;
    if (this.mixerController.stop()) {
      this.setMixerState("stopped");
      this.isPlaying = false;
      this.startTime = 0;
      this.offsetTime = 0;
    }
  }

  pause() {
    if (this.mixerController.stop()) {
      this.setMixerState("suspended");
      this.isPlaying = false;
      this.elapsedTime = this.elapsedTime + this.timeElapsed;
    }
  }

  playToggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play(this.elapsedTime);
    }
  }

  seek(offset: number) {
    const startTime = this.audioCtx.currentTime;
    if (this.mixerController.seek(startTime, offset)) {
      this.isPlaying = true;
      this.startTime = startTime;
      this.offsetTime = offset;
      this.elapsedTime = offset;
    }
  }

  setMasterGain(value: number, when: number = 0) {
    this.masterChannel.setGain(value, when);
  }

  resetSettings() {
    for (let channel of this.channels) {
      channel?.resetSettings();
    }
  }

  exportSettings(): MixerSettings | undefined {
    if (!this.channelsLoaded) {
      return;
    }
    return {
      duration: this.duration,
      master: { gain: this.masterChannel.currentGain },
      channels: this.channels.map((channel) => channel?.exportSettings()),
    };
  }
}

export default Mixer;
