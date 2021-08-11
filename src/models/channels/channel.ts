import { makeAutoObservable } from "mobx";
import { ChannelMeta, ChannelSettings, FaderInterface } from "../../types";
import { AudioAnalyser, ChannelGainController, PanController } from "../addons";

class Channel implements FaderInterface {
  index: number;
  audioCtx: AudioContext;
  buffer?: AudioBuffer;

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

  get maxGain() {
    return this.gainController.maxGain;
  }

  setLoaded(loaded: boolean) {
    this.loaded = loaded;
  }

  setDuration(duration: number) {
    this.duration = duration;
  }

  constructor(buffer: ArrayBuffer, audioCtx: AudioContext, destinationNode: AudioNode, meta: ChannelMeta) {
    makeAutoObservable(this);
    this.index = meta.index;
    this.title = meta.title;

    this.audioCtx = audioCtx;
    this.setupAudioBuffer(buffer);

    this.gainController = new ChannelGainController(this.index, audioCtx);
    this.panController = new PanController(this.index, audioCtx);
    this.audioAnalyser = new AudioAnalyser(audioCtx, this);

    this.destinationNode = destinationNode;
  }

  private setupAudioBuffer(buffer: ArrayBuffer) {
    this.audioCtx.decodeAudioData(buffer, (buffer) => {
      this.buffer = buffer;
      this.setDuration(buffer.duration);
      this.createBufferSourceNode(buffer);
      this.connectNodes();
      this.setLoaded(true);
    });
  }

  private createBufferSourceNode(buffer: AudioBuffer) {
    const sourceNode = this.audioCtx.createBufferSource();
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
    if (!this.sourceNode && this.buffer) {
      this.createBufferSourceNode(this.buffer);
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

  get isMuted() {
    return this.gainController.isMuted;
  }

  toggleMute(when: number = 0) {
    this.gainController.toggleMute(when);
  }

  get isSoloed() {
    return this.gainController.isSoloed;
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

  getCurrentLevels() {
    return this.audioAnalyser.getCurrentLevels();
  }

  getPeaks() {
    return this.audioAnalyser.getPeaks();
  }

  getCounters() {
    return this.audioAnalyser.getCounters();
  }

  exportSettings(): ChannelSettings | undefined {
    if (!this.buffer) {
      return;
    }

    return {
      buffer: this.buffer,
      gain: this.gainController.currentGain,
      pan: this.panController.currentPan,
    };
  }
}

export default Channel;
