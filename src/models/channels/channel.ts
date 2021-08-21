import { makeAutoObservable } from "mobx";
import { InitialFaderPosition } from "../../constants";
import { WaveformStore } from "../../stores";
import { ChannelMeta, ChannelSettings, FaderInterface } from "../../types";
import { AudioAnalyser, ChannelGainController, PanController } from "../addons";
import ChannelWaveformCalculator from "../waveformCalculator";

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

  // Fader & Panner
  faderPosition: number = InitialFaderPosition;
  pannerDeg: number = 0;

  get currentGain() {
    return this.gainController.currentGain;
  }

  get maxGain() {
    return this.gainController.maxGain;
  }

  get currentPan() {
    return this.panController.currentPan;
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
      this.updateWaveformData();
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

  disconnect() {
    this.gainController.disconnect();
    this.panController.disconnect();
    this.audioAnalyser.disconnect();
    this.sourceNode?.disconnect();
    this.buffer = undefined;
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

  setFaderPosition(value: number) {
    this.faderPosition = value;
  }

  setPan(value: number, when: number = 0) {
    this.panController.setPan(value, when);
  }

  setPannerDeg(value: number) {
    this.pannerDeg = value;
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

  resetSettings() {
    this.setGain(1, 0);
    this.setFaderPosition(InitialFaderPosition);
    this.setPan(0, 0);
    this.setPannerDeg(0);
    this.gainController.unMute();
    this.gainController.unSolo();
  }

  exportSettings(): ChannelSettings | undefined {
    if (!this.buffer) {
      return;
    }

    return {
      buffer: this.buffer,
      gain: this.currentGain,
      pan: this.currentPan,
    };
  }

  updateWaveformData() {
    if (!this.buffer) {
      return;
    }

    WaveformStore.setMaxDuration(this.duration);
    const widthRatio = this.duration / WaveformStore.maxDuration;
    const width = WaveformStore.width * widthRatio;
    const height = WaveformStore.height;
    const calculator = new ChannelWaveformCalculator(this.buffer, width, height, this.currentGain);
    const waveform = calculator.calculate();
    WaveformStore.updateWaveform(waveform);
  }
}

export default Channel;
