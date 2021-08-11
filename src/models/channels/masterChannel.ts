import { FaderInterface } from "../../types";
import { AudioAnalyser, MasterGainController } from "../addons";
import Mixer from "../mixer";

class MasterChannel implements FaderInterface {
  mixer: Mixer;
  audioCtx: AudioContext;
  masterGainController: MasterGainController;
  analyser: AudioAnalyser;
  maxGain: number = 3;
  faderPosition: number = 0;

  constructor(audioCtx: AudioContext, mixer: Mixer) {
    this.mixer = mixer;
    this.audioCtx = audioCtx;
    this.masterGainController = new MasterGainController(audioCtx);
    this.analyser = new AudioAnalyser(audioCtx, this);
  }

  get node() {
    return this.masterGainController.masterGainNode;
  }

  get currentGain() {
    return this.masterGainController.currentGain;
  }

  get isPlaying() {
    return this.mixer.isPlaying;
  }

  connect() {
    this.analyser.connect(this.masterGainController.masterGainNode);
  }

  setGain(value: number, when: number = 0) {
    this.masterGainController.setGain(value, when);
  }

  setFaderPosition(value: number) {
    this.faderPosition = value;
  }

  getCurrentLevels() {
    return this.analyser.getCurrentLevels();
  }

  getPeaks() {
    return this.analyser.getPeaks();
  }

  getCounters() {
    return this.analyser.getCounters();
  }
}

export default MasterChannel;
