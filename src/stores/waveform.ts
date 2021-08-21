import { makeAutoObservable } from "mobx";

class WaveformStore {
  waveform: Array<number> = [];
  maxDuration: number = 0;
  width: number = 650;
  height: number = 40;

  constructor() {
    makeAutoObservable(this);
  }

  setWaveform(waveform: Array<number>) {
    this.waveform = waveform;
  }

  setMaxDuration(duration: number) {
    this.maxDuration = Math.max(this.maxDuration, duration);
  }

  updateWaveform(waveform: Array<number>) {
    if (this.waveform.length === 0) {
      this.setWaveform(waveform);
    } else {
      this.waveform = this.waveform.map((value, index) => {
        let currentData = value ? value : 0;
        let newData = waveform[index] ? waveform[index] : 0;

        return Math.max(currentData, newData);
      });
    }
  }
}

export default new WaveformStore();
