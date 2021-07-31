import { ChannelMeta } from "../types";
import { AudioAnalyser } from "./analysers";
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
  outputNode?: AudioNode;
  destinationNode: AudioNode;

  // Controllers
  gainController: ChannelGainController;
  panController: PanController;
  audioAnalyser: AudioAnalyser;

  constructor(buffer: ArrayBuffer, audioCtx: AudioContext, destinationNode: AudioNode, meta: ChannelMeta) {
    this.channelIndex = meta.channelIndex;
    this.title = meta.title;

    this.audioCtx = audioCtx;  
    this.setupAudioBuffer(buffer);

    this.gainController = new ChannelGainController(this.channelIndex, audioCtx);
    this.panController = new PanController(this.channelIndex, audioCtx);
    this.audioAnalyser = new AudioAnalyser(this.channelIndex, audioCtx);

    this.destinationNode = destinationNode;
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
    const pannerNode = this.panController.connect(gainNode);
    const analyserNode = this.audioAnalyser.connect(pannerNode);
    analyserNode.connect(this.destinationNode)
  }

  private reconnectSourceNode() {
    if (!this.sourceNode) {
      return
    }

    this.gainController.connect(this.sourceNode);
  }

  reloadChannel() {
    if (!this.sourceNode && this.buffer) {
      this.createBufferSourceNode(this.buffer)
      this.reconnectSourceNode();
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