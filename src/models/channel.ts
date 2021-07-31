import { ChannelMeta } from "../types";
import { ChannelGainController } from "./gainControllers";
import { PanController } from "./panControllers";


class Channel {
  audioCtx: AudioContext;
  buffer?: AudioBuffer;

  // Meta
  channelIndex: number;
  title?: string;

  // States
  loaded: boolean = false;
  duration: number = 0;

  // Nodes
  sourceNode: AudioBufferSourceNode | undefined;
  analyserNode: AnalyserNode;

  // Controllers
  gainController: ChannelGainController;
  panController: PanController;

  constructor(buffer: ArrayBuffer, audioCtx: AudioContext, meta: ChannelMeta) {
    this.channelIndex = meta.channelIndex;
    this.title = meta.title;

    this.audioCtx = audioCtx;  
    this.analyserNode = this.audioCtx.createAnalyser();
    this.setupAudioBuffer(buffer);

    this.gainController = new ChannelGainController(this.channelIndex, audioCtx);
    this.panController = new PanController(this.channelIndex, audioCtx);
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
    if (!this.sourceNode) {
      return
    }

    const gainNode = this.gainController.connect(this.sourceNode);
    const pannerNode = this.panController.connect(gainNode)
    pannerNode.connect(this.analyserNode)
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