export class AudioAnalyser {
  index: number;
  leftAnalyserNode: AnalyserNode;
  rightAnalyserNode: AnalyserNode;
  spliterNode: ChannelSplitterNode;
  
  constructor(index: number, audioCtx: AudioContext) {
    this.index = index;
    this.leftAnalyserNode = audioCtx.createAnalyser();
    this.rightAnalyserNode = audioCtx.createAnalyser();
    this.spliterNode = audioCtx.createChannelSplitter();
  }

  connect(source: AudioNode) {
    this.spliterNode.connect(this.leftAnalyserNode, 0, 0)
    this.spliterNode.connect(this.rightAnalyserNode, 1, 0)
    source.connect(this.spliterNode)
    return source
  }

  getCurrentLevel() {
    const leftArray = new Uint8Array(this.leftAnalyserNode.frequencyBinCount);
    const rightArray = new Uint8Array(this.rightAnalyserNode.frequencyBinCount);
    this.leftAnalyserNode.getByteFrequencyData(leftArray);
    this.rightAnalyserNode.getByteFrequencyData(rightArray);

    return [this.getAverage(leftArray), this.getAverage(rightArray)]
  }

  private getAverage(array: Uint8Array) {
    let total = 0;
    for (let value of array) {
        total += value;
    }
    return total / array.length;
  }
}