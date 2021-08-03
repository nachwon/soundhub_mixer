import { ChannelMeta } from "../../types";
import { AudioAnalyser, ChannelGainController, PanController } from "../addons";

class Channel {
  index: number;
  #audioCtx: AudioContext;
  #buffer?: AudioBuffer;
  #maxGain: number = 1.4;

  get audioCtx() {
    return this.#audioCtx;
  }

  // Meta
  title?: string;

  // States
  loaded: boolean = false;
  isPlaying: boolean = false;
  duration: number = 0;

  // Nodes
  sourceNode: AudioBufferSourceNode | undefined;
  destinationNode: AudioNode;

  // Controllers
  gainController: ChannelGainController;
  panController: PanController;
  audioAnalyser: AudioAnalyser;

  constructor(
    buffer: ArrayBuffer,
    audioCtx: AudioContext,
    destinationNode: AudioNode,
    meta: ChannelMeta
  ) {
    this.index = meta.index;
    this.title = meta.title;

    this.#audioCtx = audioCtx;
    this.setupAudioBuffer(buffer);

    this.gainController = new ChannelGainController(this.index, audioCtx);
    this.panController = new PanController(this.index, audioCtx);
    this.audioAnalyser = new AudioAnalyser(audioCtx, this);

    this.destinationNode = destinationNode;
  }

  private setupAudioBuffer(buffer: ArrayBuffer) {
    this.#audioCtx.decodeAudioData(buffer, (buffer) => {
      this.#buffer = buffer;
      this.duration = buffer.duration;
      this.createBufferSourceNode(buffer);
      this.connectNodes();
      this.loaded = true;
    });
  }

  private createBufferSourceNode(buffer: AudioBuffer) {
    const sourceNode = this.#audioCtx.createBufferSource();
    sourceNode.buffer = buffer;
    this.sourceNode = sourceNode;
  }

  private connectNodes() {
    if (!this.sourceNode) {
      return;
    }

    const gainNode = this.gainController.connect(this.sourceNode);
    const pannerNode = this.panController.connect(gainNode);
    const analyserNode = this.audioAnalyser.connect(pannerNode);
    analyserNode.connect(this.destinationNode);
  }

  private reconnectSourceNode() {
    if (!this.sourceNode) {
      return;
    }

    this.gainController.connect(this.sourceNode);
  }

  private reloadChannel() {
    if (!this.sourceNode && this.#buffer) {
      this.createBufferSourceNode(this.#buffer);
      this.reconnectSourceNode();
    }
  }

  play(when: number, offset: number = 0) {
    this.reloadChannel();
    this.sourceNode?.start(when, offset);
    this.isPlaying = true;
  }

  stop() {
    this.sourceNode?.stop();
    this.sourceNode?.disconnect();
    this.sourceNode = undefined;
    this.isPlaying = false;
  }

  seek(when: number, offset: number) {
    this.stop();
    this.play(when, offset);
  }

  toggleMute(when: number = 0) {
    this.gainController.toggleMute(when);
  }

  toggleSolo(when: number = 0) {
    this.gainController.toggleSolo(when);
  }

  setGain(value: number, when: number = 0) {
    this.gainController.setGain(value, when);
  }

  setPan(value: number, when: number = 0) {
    this.panController.setPan(value, when);
  }
}

export default Channel;
