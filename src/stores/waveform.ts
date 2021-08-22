import { makeAutoObservable, toJS } from "mobx";
import { MaxChannelCount } from "../constants";
import { Channel } from "../models/channels";
import ChannelWaveformCalculator from "../models/waveformCalculator";
import { calcFinalWaveform } from "../utils";

class WaveformStore {
  waveform: Array<number> = [];
  channels: Array<Channel | undefined> = [];
  pcms: Array<Array<number>> = new Array(MaxChannelCount);
  channelWaveforms: Array<Array<number>> = new Array(MaxChannelCount);
  maxDuration: number = 0;
  maxRms: number = 0;
  width: number = 650;
  height: number = 40;

  constructor() {
    makeAutoObservable(this);
  }

  addChannel(channel: Channel) {
    this.channels.push(channel);
    this.setMaxDuration(channel.duration);
  }

  setWaveform(waveform: Array<number>) {
    this.waveform = waveform;
  }

  setChannelWaveform(waveform: Array<number>, index: number) {
    this.pcms[index] = waveform;
    this.channelWaveforms[index] = waveform;
  }

  setMaxDuration(duration: number) {
    this.maxDuration = Math.max(this.maxDuration, duration);
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
      const calculator = new ChannelWaveformCalculator(channel.buffer, width, height, channel.currentGain);
      const waveform = calculator.calculate();
      this.updateChannelWaveform(waveform, channel.index);
      if (sync) {
        this.updateFinalWaveform();
      }
    }
  }

  applyChannelGain(index: number, gain: number) {
    this.channelWaveforms[index] = this.pcms[index].map((value) => value * gain);
  }

  updateChannelWaveform(waveform: Array<number>, index: number) {
    this.setChannelWaveform(waveform, index);
  }

  updateFinalWaveform() {
    const finalWaveform = calcFinalWaveform(toJS(this.channelWaveforms), this.width);
    this.setWaveform(finalWaveform);
  }
}

export default new WaveformStore();
