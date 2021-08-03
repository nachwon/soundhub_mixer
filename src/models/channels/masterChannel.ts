import { AudioAnalyser, MasterGainController } from "../addons";
import Mixer from "../mixer";

class MasterChannel {
  mixer: Mixer;
  #masterGainController: MasterGainController;
  #analyser: AudioAnalyser;
  #maxGain: number = 1.4;

  constructor(audioCtx: AudioContext, mixer: Mixer) {
    this.mixer = mixer;
    this.#masterGainController = new MasterGainController(audioCtx);
    this.#analyser = new AudioAnalyser(audioCtx, this);
  }

  get node() {
    return this.#masterGainController.masterGainNode;
  }

  get currentGain() {
    return this.#masterGainController.currentGain;
  }

  get maxGain() {
    return this.#maxGain;
  }

  get isPlaying() {
    return this.mixer.isPlaying;
  }

  connect() {
    this.#analyser.connect(this.#masterGainController.masterGainNode);
  }

  setGain(value: number, when: number = 0) {
    this.#masterGainController.setGain(value, when);
  }

  getCurrentLevels() {
    return this.#analyser.getCurrentLevels();
  }

  getPeaks() {
    return this.#analyser.getPeaks();
  }

  getCounters() {
    return this.#analyser.getCounters();
  }
}

export default MasterChannel;
