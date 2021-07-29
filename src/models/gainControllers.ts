export class ChannelGainController {
  #index: number;
  gainNode: GainNode;

  // Controller
  masterController?: MasterChannelGainController;

  // States
  #currentGain: number = 0;
  #isMuted: boolean = false;
  #isSoloed: boolean = false;

  get index() {
    return this.#index
  }

  get currentGain() {
    return this.#currentGain
  }

  get isMuted() {
    if (this.#isSoloed) {
      return false
    }
    return this.#isMuted
  }

  get isSoloed() {
    return this.#isSoloed
  }

  constructor(index: number, gainNode: GainNode) {
    this.#index = index
    this.gainNode = gainNode
    this.#currentGain = gainNode.gain.defaultValue
  }
  
  connectSetController(masterController: MasterChannelGainController) {
    this.masterController = masterController
    this.masterController.add(this)
  }

  setGain(value: number, when: number = 0) {
    const boundedValue = Math.max(
      this.gainNode.gain.minValue,
      Math.min(this.gainNode.gain.maxValue, value)
    )
    this.gainNode.gain.setValueAtTime(boundedValue, when)
    this.#currentGain = boundedValue
  }

  turnOn(when: number = 0) {
    this.gainNode.gain.setValueAtTime(this.#currentGain, when)
  }

  turnOff(when: number = 0) {
    this.gainNode.gain.setValueAtTime(0, when)
  }

  mute(when: number = 0) {
    this.#isMuted = true
    if (this.masterController?.soloMode) {
      this.masterController.removeFromSoloedControllers(this)
    } else {
      this.masterController?.addToMutedControllers(this)
    }
  }

  unMute(when: number = 0) {
    this.#isMuted = false
    if (this.masterController?.soloMode) {
      this.solo()
    } else {
      this.masterController?.removeFromMutedControllers(this)
    }
  }

  toggleMute(when: number = 0) {
    if (this.#isMuted) {
      this.unMute(when)
    } else {
      this.mute(when)
    }
    this.masterController?.updateGains()
  }

  solo(when: number = 0) {
    this.#isSoloed = true
    this.masterController?.addToSoloedControllers(this)
  }

  unSolo(when: number = 0) {
    this.#isSoloed = false
    this.masterController?.removeFromSoloedControllers(this)
  }

  toggleSolo(when: number = 0) {
    if (this.#isSoloed) {
      this.unSolo(when)
    } else {
      this.solo(when)
    }
    this.masterController?.updateGains()
  }
}

export class MasterChannelGainController {
  channelGainControllers: Array<ChannelGainController> = [];
  #mutedControllers: Array<ChannelGainController> = [];
  #soloedControllers: Array<ChannelGainController> = [];

  add(channelGainController: ChannelGainController) {
    this.channelGainControllers.push(channelGainController)
  }

  addToMutedControllers(controller: ChannelGainController) {
    if (!this.#mutedControllers.includes(controller)) {
      this.#mutedControllers.push(controller)
    }
  }

  removeFromMutedControllers(controller: ChannelGainController) {
    this.#mutedControllers = this.#mutedControllers.filter((mutedController) => mutedController.index !== controller.index)
  }

  addToSoloedControllers(controller: ChannelGainController) {
    if (!this.#soloedControllers.includes(controller)) {
      this.#soloedControllers.push(controller)
    }
  }

  removeFromSoloedControllers(controller: ChannelGainController) {
    this.#soloedControllers = this.#soloedControllers.filter((soloedController) => soloedController.index !== controller.index)
  }

  updateGains() {
    if (this.soloMode) {
      for (let controller of this.channelGainControllers) {
        controller.turnOff(0)
      }
      for (let controller of this.#soloedControllers) {
       controller.turnOn(0)
      }
    } else {
      for (let controller of this.channelGainControllers) {
        controller.turnOn(0)
      }
      for (let controller of this.#mutedControllers) {
        controller.turnOff(0)
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

export class MasterGainController {
  masterGainNode: GainNode;

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
}