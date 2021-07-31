export class AudioAnalyser {
  index: number;
  analyserNode: AnalyserNode;
  
  constructor(index: number, audioCtx: AudioContext) {
    this.index = index;
    this.analyserNode = audioCtx.createAnalyser();
  }

  connect(source: AudioNode) {
    source.connect(this.analyserNode)
    return this.analyserNode
  }
}