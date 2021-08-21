import { makeAutoObservable, toJS } from "mobx";
import { MaxChannelCount } from "../constants";
import { calcFinalWaveform } from "../utils";

class WaveformStore {
  waveform: Array<number> = [];
  channelWaveforms: Array<Array<number>> = new Array(MaxChannelCount);
  maxDuration: number = 0;
  maxRms: number = 0;
  width: number = 650;
  height: number = 40;

  constructor() {
    makeAutoObservable(this);
  }

  setWaveform(waveform: Array<number>) {
    this.waveform = waveform;
  }

  setChannelWaveform(waveform: Array<number>, index: number) {
    this.channelWaveforms[index] = waveform;
  }

  setMaxDuration(duration: number) {
    this.maxDuration = Math.max(this.maxDuration, duration);
  }

  setMaxRms(rms: number) {
    this.maxRms = Math.max(this.maxRms, rms);
  }

  updateChannelWaveform(waveform: Array<number>, index: number) {
    this.setChannelWaveform(waveform, index);
  }

  updateFinalWaveform() {
    const finalWaveform = calcFinalWaveform(
      this.channelWaveforms.map((value) => toJS(value)),
      this.width
    );
    this.setWaveform(finalWaveform);
  }
}

export default new WaveformStore();
