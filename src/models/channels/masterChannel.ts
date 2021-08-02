import { AudioAnalyser, MasterGainController } from "../addons";

class MasterChannel {
  #masterGainController: MasterGainController;
  #analyser: AudioAnalyser;
  #maxGain: number = 1.4

  constructor(audioCtx: AudioContext) {
    this.#masterGainController = new MasterGainController(audioCtx);
    this.#analyser = new AudioAnalyser(audioCtx);
  }

  get node() { return this.#masterGainController.masterGainNode }

  get currentGain() { return this.#masterGainController.currentGain }

  get maxGain() { return this.#maxGain }

  connect() {
    this.#analyser.connect(this.#masterGainController.masterGainNode)
  }

  setGain(value: number, when: number = 0) {
    this.#masterGainController.setGain(value, when)
  }

  getCurrentLevels() {
    return this.#analyser.getCurrentLevels()
  }
}

export default MasterChannel
