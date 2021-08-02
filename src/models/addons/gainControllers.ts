export class ChannelGainController {
  #index: number;
  get index() { return this.#index }

  // Nodes
  #gainNode: GainNode;
  #muteGainNode: GainNode;
  #soloGainNode: GainNode;
  get soloGainNode() { return this.#soloGainNode }

  // SoloGainBroadcaster
  #broadcaster?: SoloGainBroadcaster

  // States
  #currentGain: number = 0;
  #isMuted: boolean = false;
  #isSoloed: boolean = false;  
  get currentGain() { return this.#currentGain }
  get isMuted() { return this.#isMuted }
  get isSoloed() { return this.#isSoloed }
  
  constructor(index: number, audioCtx: AudioContext) {
    this.#index = index
    this.#gainNode = audioCtx.createGain();
    this.#currentGain = this.#gainNode.gain.defaultValue
    this.#muteGainNode = audioCtx.createGain();
    this.#soloGainNode = audioCtx.createGain();
  }

  connect(source: AudioNode) {
    source?.connect(this.#gainNode);
    this.#gainNode.connect(this.#muteGainNode);
    this.#muteGainNode.connect(this.#soloGainNode);
    return this.#soloGainNode
  }

  setGain(value: number, when: number = 0) {
    const boundedValue = Math.max(
      this.#gainNode.gain.minValue,
      Math.min(this.#gainNode.gain.maxValue, value)
    )
    this.#gainNode.gain.setValueAtTime(boundedValue, when)
    this.#currentGain = boundedValue
  }

  setBroadcaster(broadcaster: SoloGainBroadcaster) {
    this.#broadcaster = broadcaster
  }
  
  mute(when: number = 0) {
    this.#isMuted = true
    this.#muteGainNode.gain.setValueAtTime(0, when)
  }

  unMute(when: number = 0) {
    this.#isMuted = false
    this.#muteGainNode.gain.setValueAtTime(1, when)
  }

  toggleMute(when: number = 0) {
    this.#isMuted ? this.unMute(when) : this.mute(when)
  }

  solo(when: number = 0) {
    this.#isSoloed = true
    this.#broadcaster?.broadcast()
  }

  unSolo(when: number = 0) {
    this.#isSoloed = false
    this.#broadcaster?.broadcast()
  }

  toggleSolo(when: number = 0) {
    this.#isSoloed ? this.unSolo(when) : this.solo(when)
  }

  turnOnSoloGain(when: number = 0) {
    this.#soloGainNode.gain.setValueAtTime(1, when)
  }

  turnOffSoloGain(when: number = 0) {
    this.#soloGainNode.gain.setValueAtTime(0, when)
  }
}


export class SoloGainBroadcaster {
  channelGainControllers: Array<ChannelGainController>
  soloedControllers: Array<ChannelGainController>

  constructor() {
    this.channelGainControllers = []
    this.soloedControllers = []
  }

  add(controller: ChannelGainController) {
    this.channelGainControllers.push(controller)
    controller.setBroadcaster(this)
  }

  broadcast() {
    this.soloedControllers = this.channelGainControllers.filter((controller) => controller.isSoloed)
    if (this.soloedControllers.length === 0) {
      for (let controller of this.channelGainControllers) {
        controller.turnOnSoloGain()
      }
      return
    }

    for (let controller of this.channelGainControllers) {
      controller.turnOffSoloGain()
    }
    for (let controller of this.soloedControllers) {
      controller.turnOnSoloGain()
    }
  }
}


export class MasterGainController {
  #masterGainNode: GainNode;
  get masterGainNode() { return this.#masterGainNode }

  constructor(audioCtx: AudioContext) {
    this.#masterGainNode = audioCtx.createGain();
    this.connectToDestination(audioCtx.destination)
  }

  private connectToDestination(destination: AudioDestinationNode) {
    this.#masterGainNode.connect(destination)
  }

  setGain(value: number, when: number) {
    const boundedValue = Math.max(
      this.#masterGainNode.gain.minValue,
      Math.min(this.#masterGainNode.gain.maxValue, value)
    )
    this.#masterGainNode.gain.setValueAtTime(boundedValue, when)
  }
}