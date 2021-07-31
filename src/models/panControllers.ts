export class PanController {
  index: number;
  audioCtx: AudioContext;
  pannerNode: StereoPannerNode;
  constructor(index: number, audioCtx: AudioContext) {
    this.index = index;
    this.audioCtx = audioCtx;
    this.pannerNode = this.audioCtx.createStereoPanner();
  }

  connect(source: AudioNode) {
    source.connect(this.pannerNode)
    return this.pannerNode
  }

  setPan(value: number, when: number = 0) {
    this.pannerNode.pan.setValueAtTime(value, when)
  }
}