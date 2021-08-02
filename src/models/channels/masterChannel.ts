import { AudioAnalyser, MasterGainController } from "../addons";

class MasterChannel {
  #masterGainController: MasterGainController;
  #analyser: AudioAnalyser;

  constructor(audioCtx: AudioContext) {
    this.#masterGainController = new MasterGainController(audioCtx);
    this.#analyser = new AudioAnalyser(audioCtx);
  }

  get node() { return this.#masterGainController.masterGainNode }

  connect() {
    this.#analyser.connect(this.#masterGainController.masterGainNode)
  }

  setGain(value: number, when: number) {
    this.#masterGainController.setGain(value, when)
  }

  getCurrentLevels() {
    return this.#analyser.getCurrentLevels()
  }
}

export default MasterChannel
