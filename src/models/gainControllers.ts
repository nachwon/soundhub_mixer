import { GainController } from "../types";


export class ChannelGainController implements GainController {
  gainNode: GainNode;

  // States
  #currentGain: number = 0;
  #isMuted: boolean = false;

  get currentGain() {
    return this.#currentGain
  }

  get isMuted() {
    return this.#isMuted
  }

  constructor(gainNode: GainNode) {
    this.gainNode = gainNode
    this.#currentGain = gainNode.gain.defaultValue
  }

  setGain(value: number, when: number = 0) {
    const boundedValue = Math.max(
      this.gainNode.gain.minValue,
      Math.min(this.gainNode.gain.maxValue, value)
    )
    this.gainNode.gain.setValueAtTime(boundedValue, when)
    this.#currentGain = boundedValue
  }

  mute(when: number = 0) {
    this.gainNode.gain.setValueAtTime(0, when)
    this.#isMuted = true
  }

  unMute(when: number = 0) {
    this.gainNode.gain.setValueAtTime(this.#currentGain, when)
    this.#isMuted = false
  }
}

export class MasterGainController implements GainController {
  masterGainNode: GainNode;
  channelGainControllers: Array<ChannelGainController> = [];

  constructor(masterGainNode: GainNode) {
    this.masterGainNode = masterGainNode
  }

  setGain(value: number, when: number) {
    const boundedValue = Math.max(
      this.masterGainNode.gain.minValue,
      Math.min(this.masterGainNode.gain.maxValue, value)
    )
    this.masterGainNode.gain.setValueAtTime(boundedValue, when)
  }

  addChannelGainController(channelGainController: ChannelGainController) {
    this.channelGainControllers.push(channelGainController)
  }

  mute(index: number, when: number = 0) {
    const controller = this.channelGainControllers[index]
    controller.mute(when)
  }

  unMute(index: number, when: number = 0) {
    const controller = this.channelGainControllers[index]
    controller.unMute(when)
  }

  muteAll(when: number) {
    for (let controller of this.channelGainControllers) {
      controller.mute(when)
    }
  }

  unMuteAll(when: number) {
    for (let controller of this.channelGainControllers) {
      controller.unMute(when)
    }
  }

  solo(index: number, when: number = 0) {
    this.muteAll(0)
    const controller = this.channelGainControllers[index]
    controller.unMute(when)
  }
}