import { ChannelSettings, MixerSettings } from "../types";
import { Channel } from "./channels";

export class MixerExporter {
  audioCtx: OfflineAudioContext;
  channels: Array<Channel> = [];
  sampleRate: number = 44100;
  numberOfChannels: number = 2;
  settings: MixerSettings;

  constructor(settings: MixerSettings) {
    this.settings = settings;
    this.audioCtx = new OfflineAudioContext(
      this.numberOfChannels,
      this.sampleRate * settings.duration,
      this.sampleRate
    );
  }

  writeHeaders(buffer: Float32Array) {
    let arrayBuffer = new ArrayBuffer(44 + buffer.length * 2),
      view = new DataView(arrayBuffer);

    this.writeString(view, 0, "RIFF");
    view.setUint32(4, 32 + buffer.length * 2, true);
    this.writeString(view, 8, "WAVE");
    this.writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 2, true);
    view.setUint32(24, this.sampleRate, true);
    view.setUint32(28, this.sampleRate * 4, true);
    view.setUint16(32, 4, true);
    view.setUint16(34, 16, true);
    this.writeString(view, 36, "data");
    view.setUint32(40, buffer.length * 2, true);

    return this.floatTo16BitPCM(view, buffer, 44);
  }

  floatTo16BitPCM(dataview: DataView, buffer: Float32Array, offset: number) {
    for (var i = 0; i < buffer.length; i++, offset += 2) {
      let tmp = Math.max(-1, Math.min(1, buffer[i]));
      dataview.setInt16(offset, tmp < 0 ? tmp * 0x8000 : tmp * 0x7fff, true);
    }
    return dataview;
  }

  writeString(dataview: DataView, offset: number, header: string) {
    for (var i = 0; i < header.length; i++) {
      dataview.setUint8(offset + i, header.charCodeAt(i));
    }
  }

  interleave(input: AudioBuffer) {
    const bufferLeft = input.getChannelData(0);
    const bufferRight = input.getChannelData(1);
    const length = input.length * 2;
    const result = new Float32Array(length);
    let index = 0;
    let inputIndex = 0;

    while (index < length) {
      result[index++] = bufferLeft[inputIndex];
      result[index++] = bufferRight[inputIndex];
      inputIndex++;
    }
    return result;
  }

  renderURL(blob: Blob) {
    return (window.URL || window.webkitURL).createObjectURL(blob);
  }

  exportToWav(buffer: AudioBuffer) {
    const type = "audio/wav";
    const recorded = this.interleave(buffer);
    const dataview = this.writeHeaders(recorded);
    const audioBlob = new Blob([dataview], { type: type });

    return audioBlob;
  }

  setupChannelContext(settings: ChannelSettings) {
    const source = this.audioCtx.createBufferSource();
    const gainNode = this.audioCtx.createGain();
    const pannerNode = this.audioCtx.createStereoPanner();
    source.buffer = settings.buffer;
    source.connect(gainNode);
    gainNode.connect(pannerNode);

    gainNode.gain.value = settings.gain;
    pannerNode.pan.value = settings.pan;
    source.start(0);
    return pannerNode;
  }

  setupMasterContext(settings: MixerSettings) {
    const masterGainNode = this.audioCtx.createGain();
    for (let channelSetting of settings.channels) {
      if (channelSetting) {
        const channelOutputNode = this.setupChannelContext(channelSetting);
        channelOutputNode.connect(masterGainNode);
      }
    }

    masterGainNode.gain.value = settings.master.gain;
    masterGainNode.connect(this.audioCtx.destination);
  }

  download(blob: Blob) {
    const a = document.createElement("a");
    const href = this.renderURL(blob);
    const hrefSplit = href.split("/");
    const name = "mixed-" + href.split("/")[hrefSplit.length - 1];
    a.href = href;
    a.download = `${name}.${blob.type.split("/")[1]}`;
    a.click();
    return a;
  }

  export(onPrepared?: Function) {
    this.setupMasterContext(this.settings);

    this.audioCtx.startRendering().then((audioBuffer) => {
      const wavBlob = this.exportToWav(audioBuffer);
      this.download(wavBlob);

      if (onPrepared) {
        onPrepared();
      }
    });
  }
}
