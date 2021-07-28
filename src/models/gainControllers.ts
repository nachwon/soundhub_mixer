export class ChannelGainController {
  #index: number;
  gainNode: GainNode;

  // States
  #currentGain: number = 0;
  #isMuted: boolean = false;

  get index() {
    return this.#index
  }

  get currentGain() {
    return this.#currentGain
  }

  get isMuted() {
    return this.#isMuted
  }

  constructor(index: number, gainNode: GainNode) {
    this.#index = index
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

export class MasterGainController {
  masterGainNode: GainNode;
  channelGainControllers: Array<ChannelGainController> = [];

  #mutedControllers: Array<ChannelGainController> = [];
  #soloedControllers: Array<ChannelGainController> = [];

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
    if (!this.soloMode && !this.#mutedControllers.includes(controller)) {
      this.#mutedControllers.push(controller)
    }
  }

  unMute(index: number, when: number = 0) {
    const controller = this.channelGainControllers[index]
    controller.unMute(when)
    if (!this.soloMode) {
      this.#mutedControllers = this.#mutedControllers.filter(
        (mutedController) => mutedController.index !== controller.index
      )
    }
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
    const controller = this.channelGainControllers[index]
    if (!this.#soloedControllers.includes(controller)) {
      this.#soloedControllers.push(controller)
    }

    this.muteAll(0)
    for (let controller of this.#soloedControllers) {
      controller.unMute(when)
    }
  }

  unSolo(index: number, when: number = 0) {
    const controller = this.channelGainControllers[index]
    this.#soloedControllers = this.#soloedControllers.filter((soloedController) => soloedController.index !== controller.index)
    if (this.#soloedControllers.length === 0) {
      this.unMuteAll(0)
      for (let controller of this.#mutedControllers) {
        controller.mute(when)
      }
    } else {
      this.muteAll(0)
      for (let controller of this.#soloedControllers) {
        controller.unMute(when)
      }
    }
  }

  get soloCount() {
    return this.#soloedControllers.length
  }

  get soloMode() {
    return this.#soloedControllers.length > 0
  }

  get mutedControllers() {
    return this.#mutedControllers
  }
}