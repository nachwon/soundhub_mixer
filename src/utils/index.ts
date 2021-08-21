import { MIXER_SETTINGS } from "../constants";
import axios from "axios";

export class BufferExtractor {
  async extract(src: File | string, onProgressUpdate?: (e: ProgressEvent) => void): Promise<ArrayBuffer | undefined> {
    if (typeof src === "string") {
      return await this.fromUrl(src, onProgressUpdate);
    } else if (src instanceof File) {
      return await this.fromFile(src);
    } else {
      return undefined;
    }
  }

  async fromFile(file: File) {
    return await file.arrayBuffer();
  }

  async fromUrl(url: string, onProgressUpdate?: (e: ProgressEvent) => void) {
    try {
      const response = await axios.get(url, { responseType: "arraybuffer", onDownloadProgress: onProgressUpdate });
      return response.data;
    } catch (error) {
      window.alert(error);
    }
  }
}

export const toDBFS = (buffer: Array<number>) => {
  var len = buffer.length,
    total = 0,
    i = 0,
    rms,
    db;

  while (i < len) {
    total += buffer[i] * buffer[i++];
  }

  rms = Math.sqrt(total / len);
  db = 20 * (Math.log(rms) / Math.LN10);
  return Math.max(-192, db);
};

export const dBFSToMeterHeight = (dBFS: number) => {
  return ((-dBFS - 48) * MIXER_SETTINGS.faderLength) / -48;
};

export const toMMSS = (sec_num: number) => {
  let minutes: number | string = Math.floor(sec_num / 60);
  let seconds: number | string = Math.floor(sec_num - minutes * 60);

  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return minutes + ":" + seconds;
};

export const getScaledGainValue = (gainValue: number, maxGain: number) => {
  let gainValueScaled;
  if (gainValue >= 1) {
    gainValueScaled =
      ((maxGain - 1) / (MIXER_SETTINGS.faderMaxPercent - MIXER_SETTINGS.faderIdlePercent)) *
        (gainValue - MIXER_SETTINGS.faderIdlePercent) +
      1;
  } else {
    gainValueScaled = gainValue;
  }
  return gainValueScaled;
};

export const calcFinalWaveform = (waveforms: Array<Array<number>>, width: number) => {
  const finalWaveform = [];

  for (let i = 0; i < width; i++) {
    let maxRms = 0;
    for (let channelWaveform of waveforms) {
      if (channelWaveform) {
        const curremtRms = channelWaveform[i] ? channelWaveform[i] : 0;
        maxRms = Math.max(curremtRms, maxRms);
      }
    }
    finalWaveform.push(maxRms);
  }

  return finalWaveform;
};
