import { ChannelMeta } from "../types";
import { ChannelGainController } from "./gainControllers";


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

  // Controllers
  gainController: ChannelGainController;

  constructor(buffer: ArrayBuffer, audioCtx: AudioContext, meta: ChannelMeta) {
    this.channelIndex = meta.channelIndex;

    this.audioCtx = audioCtx;
    this.gainNode = this.audioCtx.createGain();    
    this.pannerNode = this.audioCtx.createStereoPanner();
    this.analyserNode = this.audioCtx.createAnalyser();
    this.setupAudioBuffer(buffer);

    this.gainController = new ChannelGainController(this.gainNode);
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

  play(when: number, offset: number = 0) {
    this.reloadChannel();
    this.sourceNode?.start(when, offset)
  }

  stop() {
    this.sourceNode?.stop();
    this.sourceNode?.disconnect();
    this.sourceNode = undefined;
  }

  seek(when: number, offset: number) {
    this.stop();
    this.reloadChannel();
    this.sourceNode?.start(when, offset)
  }
}

export default Channel;