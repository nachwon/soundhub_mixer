export type ChannelDto = {
  src: File | string;
  title?: string;
};

export type ChannelMeta = {
  index: number;
  src: File | string;
  title?: string;
};

export interface MixerController {
  play: (when: number, offset: number) => boolean;
  stop: () => boolean;
  pause: () => boolean;
  seek: (when: number, offset: number) => boolean;
}

export interface FaderHandleProps {
  position: number;
}

export interface FaderInterface {
  index: number;
  audioCtx: AudioContext;
  currentGain: number;
  actualGain: number;
  maxGain: number;
  setGain: (value: number, when?: number) => void;
  setFaderPosition: (value: number) => void;
  getCurrentLevels: () => Array<number>;
  getPeaks: () => Array<number>;
  getCounters: () => Array<number>;
  updateWaveformData?: (sync: boolean) => void;
}

export type ChannelSettings = {
  buffer: AudioBuffer;
  gain: number;
  pan: number;
};

export type MixerSettings = {
  duration: number;
  master: {
    gain: number;
  };
  channels: Array<ChannelSettings | undefined>;
};
