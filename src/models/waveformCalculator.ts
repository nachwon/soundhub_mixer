import { WaveformStore } from "../stores";

export default class ChannelWaveformCalculator {
  buffer: AudioBuffer;
  chunkSize: number;
  barCount: number;
  waveformHeight: number;

  constructor(buffer: AudioBuffer, waveformWidth: number, waveformHeight: number) {
    this.buffer = buffer;
    this.barCount = Math.round(waveformWidth / 2);
    this.chunkSize = Math.ceil(this.buffer.length / this.barCount);
    this.waveformHeight = Math.round(waveformHeight);
  }

  calculate() {
    const waveformData = [];
    const pcmL = this.buffer.getChannelData(0);
    const pcmR = this.buffer.getChannelData(1);
    const chunkifiedArrayL = this.chunkifyArray(pcmL);
    const chunkifiedArrayR = this.chunkifyArray(pcmR);
    let maxRms = 0;

    for (let i = 0; i < this.barCount; i++) {
      const chunkL = chunkifiedArrayL[i];
      const chunkR = chunkifiedArrayR[i];
      const rmsL = this.getRMS(chunkL);
      const rmsR = this.getRMS(chunkR);
      const rmsSum = rmsL + rmsR;
      waveformData.push(rmsSum);
      maxRms = Math.max(rmsSum, maxRms);
    }

    WaveformStore.setMaxRms(maxRms);

    return this.convertToWaveform(waveformData, WaveformStore.maxRms);
  }

  chunkifyArray(array: Float32Array): Array<Float32Array> {
    return Array.from({ length: this.barCount }, (value, index) =>
      array.slice(index * this.chunkSize, index * this.chunkSize + this.chunkSize)
    );
  }

  getRMS(array: Float32Array): number {
    let sumOfSquared = 0;
    for (let value of array) {
      sumOfSquared += value * value;
    }
    const meanSquare = sumOfSquared / array.length;
    return Math.sqrt(meanSquare);
  }

  convertToWaveform(array: Array<number>, maxRms: number) {
    return array.map((value, index) => (this.waveformHeight * value) / maxRms);
  }
}
