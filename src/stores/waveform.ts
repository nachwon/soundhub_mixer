import { makeAutoObservable, toJS } from "mobx";
import { MaxChannelCount } from "../constants";

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
    this.updateWaveform();
  }

  updateWaveform() {
    const waveform = [];
    for (let i = 0; i < this.width; i++) {
      let maxRms = 0;
      for (let channelWaveform of this.channelWaveforms) {
        channelWaveform = toJS(channelWaveform);
        if (channelWaveform) {
          const curremtRms = channelWaveform[i] ? channelWaveform[i] : 0;
          maxRms = Math.max(curremtRms, maxRms);
        }
      }
      waveform.push(maxRms);
    }
    this.setWaveform(waveform);
  }
}

export default new WaveformStore();
