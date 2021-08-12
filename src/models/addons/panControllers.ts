import { makeAutoObservable } from "mobx";

export class PanController {
  index: number;

  // Nodes
  audioCtx: AudioContext;
  pannerNode: StereoPannerNode;

  constructor(index: number, audioCtx: AudioContext) {
    makeAutoObservable(this);
    this.index = index;
    this.audioCtx = audioCtx;
    this.pannerNode = this.audioCtx.createStereoPanner();
  }

  get currentPan() {
    return this.pannerNode.pan.value;
  }

  connect(source: AudioNode) {
    source.connect(this.pannerNode);
    return this.pannerNode;
  }

  disconnect() {
    this.pannerNode.disconnect();
  }

  setPan(value: number, when: number = 0) {
    this.pannerNode.pan.setValueAtTime(value, when);
  }
}
