import { toDBFS } from "../../utils";

export class AudioAnalyser {
  // Nodes
  #leftAnalyserNode: AnalyserNode;
  #rightAnalyserNode: AnalyserNode;
  #spliterNode: ChannelSplitterNode;

  // Levels
  #maxLevelLeft: number = -Infinity;
  #maxLevelRight: number = -Infinity;

  // Counter
  #leftCounter: number = 0;
  #rightCounter: number = 0;

  // Const
  #maxCount: number = 100;

  constructor(audioCtx: AudioContext) {
    this.#leftAnalyserNode = audioCtx.createAnalyser();
    this.#rightAnalyserNode = audioCtx.createAnalyser();
    this.#spliterNode = audioCtx.createChannelSplitter();
  }

  connect(source: AudioNode) {
    this.#spliterNode.connect(this.#leftAnalyserNode, 0, 0);
    this.#spliterNode.connect(this.#rightAnalyserNode, 1, 0);
    source.connect(this.#spliterNode);
    return source;
  }

  getCurrentLevels() {
    this.#leftCounter++;
    this.#rightCounter++;

    const leftArray = new Uint8Array(this.#leftAnalyserNode.frequencyBinCount);
    const rightArray = new Uint8Array(
      this.#rightAnalyserNode.frequencyBinCount
    );
    this.#leftAnalyserNode.getByteTimeDomainData(leftArray);
    this.#rightAnalyserNode.getByteTimeDomainData(rightArray);

    const levels = [this.getDBFS(leftArray), this.getDBFS(rightArray)];
    this.setMaxLevels(levels);
    this.resetMaxLevels();

    return levels;
  }

  getPeaks() {
    return [this.#maxLevelLeft, this.#maxLevelRight];
  }

  getCounters() {
    return [this.#leftCounter, this.#rightCounter];
  }

  private getDBFS(array: Uint8Array): number {
    const floats = new Array(array.length);
    for (let i = 0; i < array.length; i++) {
      floats[i] = (array[i] * 2) / 255 - 1;
    }
    return toDBFS(floats);
  }

  private setMaxLevels(levels: Array<number>) {
    const [leftLevel, rightLevel] = levels;
    if (this.#maxLevelLeft < leftLevel) {
      this.#maxLevelLeft = leftLevel;
      this.#leftCounter = 0;
    }

    if (this.#maxLevelRight < rightLevel) {
      this.#maxLevelRight = rightLevel;
      this.#rightCounter = 0;
    }
  }

  private resetMaxLevels() {
    if (this.#leftCounter === this.#maxCount) {
      this.#maxLevelLeft = -Infinity;
      this.#leftCounter = -Infinity;
    }

    if (this.#rightCounter === this.#maxCount) {
      this.#maxLevelRight = -Infinity;
      this.#rightCounter = -Infinity;
    }
  }
}
