import { makeAutoObservable, toJS } from "mobx";
import { MaxChannelCount } from "../constants";
import { Channel } from "../models/channels";
import ChannelWaveformCalculator from "../models/waveformCalculator";
import { calcFinalWaveform } from "../utils";

class WaveformStore {
  waveform: Array<number> = [];
  channels: Array<Channel | undefined> = new Array(MaxChannelCount);
  pcms: Array<Array<number>> = new Array(MaxChannelCount);
  channelWaveforms: Array<Array<number>> = new Array(MaxChannelCount);
  maxRms: number = 0;
  width: number = 650;
  height: number = 40;

  constructor() {
    makeAutoObservable(this);
  }

  addChannel(channel: Channel) {
    this.channels[channel.index] = channel;
  }

  removeChannel(index: number) {
    this.channels[index] = undefined;
    this.removeChannelWaveform(index);
  }

  setWaveform(waveform: Array<number>) {
    this.waveform = waveform;
  }

  getChannelWaveforms() {
    return this.channelWaveforms.map((value: Array<number>) => toJS(value));
  }

  setChannelWaveform(waveform: Array<number>, index: number) {
    this.pcms[index] = waveform;
    this.channelWaveforms[index] = waveform;
  }

  removeChannelWaveform(index: number) {
    this.pcms[index] = [];
    this.channelWaveforms[index] = [];
  }

  get maxDuration() {
    let maxVal = 0;
    for (let channel of this.channels) {
      if (!channel) {
        continue;
      }

      maxVal = Math.max(channel.duration, maxVal);
    }
    return maxVal;
  }

  setMaxRms(rms: number) {
    this.maxRms = Math.max(this.maxRms, rms);
  }

  updateWaveformData(sync: boolean = true) {
    for (let channel of this.channels) {
      if (!channel || !channel.buffer) {
        continue;
      }

      const widthRatio = channel.duration / this.maxDuration;
      const width = this.width * widthRatio;
      const height = this.height;
      const calculator = new ChannelWaveformCalculator(channel.buffer, width, height);
      const waveform = calculator.calculate();
      this.setChannelWaveform(waveform, channel.index);
      this.applyChannelGain(channel.index, channel.currentGain);
    }

    if (sync) {
      this.updateFinalWaveform();
    }
  }

  applyChannelGain(index: number, gain: number) {
    this.channelWaveforms[index] = this.pcms[index].map((value) => Math.min(value * gain, this.height));
  }

  updateChannelGains() {
    for (let channel of this.channels) {
      if (!channel) {
        continue;
      }
      this.applyChannelGain(channel?.index, channel.actualGain);
    }
  }

  updateFinalWaveform() {
    const finalWaveform = calcFinalWaveform(toJS(this.channelWaveforms), this.width);
    this.setWaveform(finalWaveform);
  }

  resetWaveform() {
    this.channelWaveforms = [...this.pcms];
    this.updateFinalWaveform();
  }
}

export default new WaveformStore();
