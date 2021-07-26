import axios from "axios";
import { ChannelMeta } from "../types";


export class BufferExtractor {
  async extract(src: File | string): Promise<ArrayBuffer | undefined> {
    if (typeof (src) === 'string') {
      return await this.fromUrl(src)
    } else if (src instanceof File) {
      return await this.fromFile(src)
    } else {
      return undefined
    }
  }

  async fromFile(file: File) {
    return await file.arrayBuffer();
  }

  async fromUrl(url: string) {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
}

class Channel {
  audioCtx: AudioContext;
  channelIndex: number;
  buffer?: AudioBuffer;
  loaded: boolean = false;

  duration: number = 0;

  // Nodes
  sourceNode: AudioBufferSourceNode | undefined;
  gainNode: GainNode;
  pannerNode: StereoPannerNode;
  analyserNode: AnalyserNode;

  constructor(buffer: ArrayBuffer, audioCtx: AudioContext, meta: ChannelMeta) {
    this.channelIndex = meta.channelIndex;

    this.audioCtx = audioCtx;
    this.gainNode = this.audioCtx.createGain();    
    this.pannerNode = this.audioCtx.createStereoPanner();
    this.analyserNode = this.audioCtx.createAnalyser();
    this.setupAudioBuffer(buffer);
  }

  private setupAudioBuffer(buffer: ArrayBuffer) {
    this.audioCtx.decodeAudioData(buffer, (buffer) => {
      this.buffer = buffer;
      this.duration = buffer.duration;
      this.createBufferSourceNode(buffer)
      this.connectNodes();
      this.loaded = true;
    })
  }

  private createBufferSourceNode(buffer: AudioBuffer) {
    const sourceNode = this.audioCtx.createBufferSource();
    sourceNode.buffer = buffer;
    this.sourceNode = sourceNode;
  }

  private connectNodes() {
    this.sourceNode?.connect(this.gainNode);
    this.gainNode.connect(this.pannerNode);
    this.pannerNode.connect(this.analyserNode);
  }

  connect(masterGainNode: GainNode) {
    this.analyserNode.connect(masterGainNode);
  }

  reloadChannel() {
    if (!this.sourceNode && this.buffer) {
      this.createBufferSourceNode(this.buffer)
      this.connectNodes();
    }
  }

  play(when: number = 0) {
    this.reloadChannel();
    this.sourceNode?.start(when)
  }

  stop() {
    this.sourceNode?.stop();
    this.sourceNode?.disconnect();
    this.sourceNode = undefined;
  }

  seek(offset: number) {
    this.stop();
    this.reloadChannel();
    this.sourceNode?.start(0, offset)
  }
}

export default Channel;