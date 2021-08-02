export class AudioAnalyser {
  #index: number;

  // Nodes
  #leftAnalyserNode: AnalyserNode;
  #rightAnalyserNode: AnalyserNode;
  #spliterNode: ChannelSplitterNode;

  // Levels
  #maxLevelLeft: number = 0;
  #maxLevelRight: number = 0;
  get maxLevelLeft() { return this.#maxLevelLeft }
  get maxLevelRight() { return this.#maxLevelRight }

  // Counter
  #leftCounter: number = 0;
  #rightCounter: number = 0;

  // Const
  #maxCount: number = 100;

  constructor(index: number, audioCtx: AudioContext) {
    this.#index = index;
    this.#leftAnalyserNode = audioCtx.createAnalyser();
    this.#rightAnalyserNode = audioCtx.createAnalyser();
    this.#spliterNode = audioCtx.createChannelSplitter();
  }

  connect(source: AudioNode) {
    this.#spliterNode.connect(this.#leftAnalyserNode, 0, 0)
    this.#spliterNode.connect(this.#rightAnalyserNode, 1, 0)
    source.connect(this.#spliterNode)
    return source
  }

  getCurrentLevels() {
    this.#leftCounter++
    this.#rightCounter++

    const leftArray = new Uint8Array(this.#leftAnalyserNode.frequencyBinCount);
    const rightArray = new Uint8Array(this.#rightAnalyserNode.frequencyBinCount);
    this.#leftAnalyserNode.getByteFrequencyData(leftArray);
    this.#rightAnalyserNode.getByteFrequencyData(rightArray);

    const levels = [this.getAverage(leftArray), this.getAverage(rightArray)]
    this.setMaxLevels(levels)
    this.resetMaxLevels()

    return levels
  }

  private getAverage(array: Uint8Array) {
    let total = 0;
    for (let value of array) {
        total += value;
    }
    return total / array.length;
  }

  private setMaxLevels(levels: Array<number>) {
    const leftLevel = levels[0]
    const rightLevel = levels[1]

    if (this.#maxLevelLeft < leftLevel) {
      this.#maxLevelLeft = leftLevel;
      this.#leftCounter = 0
    }

    if (this.#maxLevelRight < rightLevel) {
      this.#maxLevelRight = rightLevel
      this.#rightCounter = 0
    }
  }

  private resetMaxLevels() {
    if (this.#leftCounter === this.#maxCount) {
      this.#maxLevelLeft = 0
      this.#leftCounter = 0
    }

    if (this.#rightCounter === this.#maxCount) {
      this.#maxLevelRight = 0
      this.#rightCounter = 0
    }
  }
}