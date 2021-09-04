import { makeAutoObservable } from "mobx";

export class ChannelGainController {
  index: number;

  // Nodes
  gainNode: GainNode;
  muteGainNode: GainNode;
  soloGainNode: GainNode;

  // SoloGainBroadcaster
  broadcaster?: SoloGainBroadcaster;

  // States
  currentGain: number = 0;
  isMuted: boolean = false;
  isSoloed: boolean = false;
  isMutedBySolo: boolean = false;

  get maxGain() {
    return 3;
  }

  get actualGain() {
    const solo = this.isMutedBySolo ? 0 : 1;
    const mute = this.isMuted ? 0 : 1;
    return this.currentGain * solo * mute;
  }

  constructor(index: number, audioCtx: AudioContext) {
    makeAutoObservable(this);
    this.index = index;
    this.gainNode = audioCtx.createGain();
    this.currentGain = this.gainNode.gain.defaultValue;
    this.muteGainNode = audioCtx.createGain();
    this.soloGainNode = audioCtx.createGain();
  }

  connect(source: AudioNode) {
    source?.connect(this.gainNode);
    this.gainNode.connect(this.muteGainNode);
    this.muteGainNode.connect(this.soloGainNode);
    return this.soloGainNode;
  }

  disconnect() {
    this.gainNode.disconnect();
    this.muteGainNode.disconnect();
    this.soloGainNode.disconnect();
  }

  setGain(value: number, when: number = 0) {
    const boundedValue = Math.max(this.gainNode.gain.minValue, Math.min(this.gainNode.gain.maxValue, value));
    this.gainNode.gain.setValueAtTime(boundedValue, when);
    this.currentGain = boundedValue;
  }

  setBroadcaster(broadcaster: SoloGainBroadcaster) {
    this.broadcaster = broadcaster;
  }

  mute(when: number = 0) {
    this.isMuted = true;
    this.muteGainNode.gain.setValueAtTime(0, when);
  }

  unMute(when: number = 0) {
    this.isMuted = false;
    this.muteGainNode.gain.setValueAtTime(1, when);
  }

  toggleMute(when: number = 0) {
    this.isMuted ? this.unMute(when) : this.mute(when);
  }

  solo(when: number = 0) {
    this.isSoloed = true;
    this.broadcaster?.broadcast();
  }

  unSolo(when: number = 0) {
    this.isSoloed = false;
    this.broadcaster?.broadcast();
  }

  toggleSolo(when: number = 0) {
    this.isSoloed ? this.unSolo(when) : this.solo(when);
  }

  turnOnSoloGain(when: number = 0) {
    this.isMutedBySolo = false;
    this.soloGainNode.gain.setValueAtTime(1, when);
  }

  turnOffSoloGain(when: number = 0) {
    this.isMutedBySolo = true;
    this.soloGainNode.gain.setValueAtTime(0, when);
  }
}

export class SoloGainBroadcaster {
  channelGainControllers: Array<ChannelGainController> = new Array(8);
  soloedControllers: Array<ChannelGainController> = new Array(8);

  constructor() {
    makeAutoObservable(this);
  }

  add(index: number, controller: ChannelGainController) {
    this.channelGainControllers[index] = controller;
    controller.setBroadcaster(this);
    this.broadcast();
  }

  remove(index: number) {
    delete this.channelGainControllers[index];
  }

  broadcast() {
    this.soloedControllers = this.channelGainControllers.filter((controller) => controller?.isSoloed);
    if (this.soloedControllers.length === 0) {
      for (let controller of this.channelGainControllers) {
        controller?.turnOnSoloGain();
      }
      return;
    }

    for (let controller of this.channelGainControllers) {
      controller?.turnOffSoloGain();
    }
    for (let controller of this.soloedControllers) {
      controller?.turnOnSoloGain();
    }
  }
}

export class MasterGainController {
  masterGainNode: GainNode;

  constructor(audioCtx: AudioContext) {
    makeAutoObservable(this);
    this.masterGainNode = audioCtx.createGain();
    this.connectToDestination(audioCtx.destination);
  }

  get currentGain() {
    return this.masterGainNode.gain.value;
  }

  private connectToDestination(destination: AudioDestinationNode) {
    this.masterGainNode.connect(destination);
  }

  setGain(value: number, when: number) {
    const boundedValue = Math.max(
      this.masterGainNode.gain.minValue,
      Math.min(this.masterGainNode.gain.maxValue, value)
    );
    this.masterGainNode.gain.setValueAtTime(boundedValue, when);
  }
}
