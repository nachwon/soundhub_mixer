export class ChannelGainController {
  #index: number;
  gainNode: GainNode;
  muteGainNode: GainNode;
  soloGainNode: GainNode;
  broadcaster?: channelGainBroadcaster

  // States
  #currentGain: number = 0;
  #isMuted: boolean = false;
  #isSoloed: boolean = false;

  get index() {return this.#index}
  get currentGain() {return this.#currentGain}
  get isMuted() {return this.#isMuted}
  get isSoloed() {return this.#isSoloed}

  constructor(index: number, audioCtx: AudioContext) {
    this.#index = index
    this.gainNode = audioCtx.createGain();
    this.#currentGain = this.gainNode.gain.defaultValue
    this.muteGainNode = audioCtx.createGain();
    this.soloGainNode = audioCtx.createGain();
  }

  connect(source: AudioNode, target: AudioNode) {
    source?.connect(this.gainNode);
    this.gainNode.connect(this.muteGainNode);
    this.muteGainNode.connect(this.soloGainNode);
    this.soloGainNode.connect(target);
  }

  setGain(value: number, when: number = 0) {
    const boundedValue = Math.max(
      this.gainNode.gain.minValue,
      Math.min(this.gainNode.gain.maxValue, value)
    )
    this.gainNode.gain.setValueAtTime(boundedValue, when)
    this.#currentGain = boundedValue
  }

  setBroadcaster(broadcaster: channelGainBroadcaster) {
    this.broadcaster = broadcaster
  }
  
  mute(when: number = 0) {
    this.#isMuted = true
    this.muteGainNode.gain.setValueAtTime(0, when)
  }

  unMute(when: number = 0) {
    this.#isMuted = false
    this.muteGainNode.gain.setValueAtTime(1, when)
  }

  toggleMute(when: number = 0) {
    this.#isMuted ? this.unMute(when) : this.mute(when)
  }

  solo(when: number = 0) {
    this.#isSoloed = true
    this.broadcaster?.applySolo()
  }

  unSolo(when: number = 0) {
    this.#isSoloed = false
    this.broadcaster?.applySolo()
  }

  toggleSolo(when: number = 0) {
    this.#isSoloed ? this.unSolo(when) : this.solo(when)
  }
}


export class channelGainBroadcaster {
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

  applySolo() {
    this.soloedControllers = this.channelGainControllers.filter((controller) => controller.isSoloed)
    console.log(this.soloedControllers)
    if (this.soloedControllers.length === 0) {
      for (let controller of this.channelGainControllers) {
        controller.soloGainNode.gain.setValueAtTime(1, 0)
      }
      return
    }

    for (let controller of this.channelGainControllers) {
      controller.soloGainNode.gain.setValueAtTime(0, 0)
    }
    for (let controller of this.soloedControllers) {
      controller.soloGainNode.gain.setValueAtTime(1, 0)
    }
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