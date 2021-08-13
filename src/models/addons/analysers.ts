import { makeAutoObservable } from "mobx";
import { toDBFS } from "../../utils";
import { Channel, MasterChannel } from "../channels";

export class AudioAnalyser {
  channel: MasterChannel | Channel;

  // Nodes
  leftAnalyserNode: AnalyserNode;
  rightAnalyserNode: AnalyserNode;
  spliterNode: ChannelSplitterNode;

  // Levels
  levelLeft: number = -Infinity;
  levelRight: number = -Infinity;
  maxLevelLeft: number = -Infinity;
  maxLevelRight: number = -Infinity;

  // Counter
  leftCounter: number = 0;
  rightCounter: number = 0;

  // Const
  maxCount: number = 100;

  // TODO: Change channel to ref channel interface
  constructor(audioCtx: AudioContext, channel: MasterChannel | Channel) {
    makeAutoObservable(this);
    this.channel = channel;
    this.leftAnalyserNode = audioCtx.createAnalyser();
    this.rightAnalyserNode = audioCtx.createAnalyser();
    this.spliterNode = audioCtx.createChannelSplitter();
  }

  connect(source: AudioNode) {
    this.spliterNode.connect(this.leftAnalyserNode, 0, 0);
    this.spliterNode.connect(this.rightAnalyserNode, 1, 0);
    source.connect(this.spliterNode);
    return source;
  }

  disconnect() {
    this.leftAnalyserNode.disconnect();
    this.rightAnalyserNode.disconnect();
    this.spliterNode.disconnect();
  }

  getCurrentLevels(): Array<number> {
    this.leftCounter++;
    this.rightCounter++;

    let levels;
    if (this.channel.isPlaying) {
      levels = this.updateCurrentLevels();
    } else {
      levels = this.decayLevels();
    }

    this.resetMaxLevels();
    return levels;
  }

  private updateCurrentLevels(): Array<number> {
    const leftArray = new Uint8Array(this.leftAnalyserNode.frequencyBinCount);
    const rightArray = new Uint8Array(this.rightAnalyserNode.frequencyBinCount);
    this.leftAnalyserNode.getByteTimeDomainData(leftArray);
    this.rightAnalyserNode.getByteTimeDomainData(rightArray);

    this.levelLeft = this.getDBFS(leftArray);
    this.levelRight = this.getDBFS(rightArray);

    const levels = [this.levelLeft, this.levelRight];
    this.setMaxLevels(levels);
    return levels;
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
    if (this.maxLevelLeft < leftLevel) {
      this.maxLevelLeft = leftLevel;
      this.leftCounter = 0;
    }

    if (this.maxLevelRight < rightLevel) {
      this.maxLevelRight = rightLevel;
      this.rightCounter = 0;
    }
  }

  private decayLevels(): Array<number> {
    if (this.levelLeft < -48) {
      this.levelLeft = -Infinity;
    } else {
      this.levelLeft -= 0.5;
    }

    if (this.levelRight < -48) {
      this.levelRight = -Infinity;
    } else {
      this.levelRight -= 0.5;
    }
    this.resetMaxLevels();
    return [this.levelLeft, this.levelRight];
  }

  private resetMaxLevels() {
    if (this.leftCounter === this.maxCount) {
      this.maxLevelLeft = -Infinity;
      this.leftCounter = -Infinity;
    }

    if (this.rightCounter === this.maxCount) {
      this.maxLevelRight = -Infinity;
      this.rightCounter = -Infinity;
    }
  }

  getPeaks() {
    return [this.maxLevelLeft, this.maxLevelRight];
  }

  getCounters() {
    return [this.leftCounter, this.rightCounter];
  }
}
