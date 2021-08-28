import { WaveformStore } from "../../../stores";

export const calcFinalWaveform = (waveforms: Array<Array<number>>, width: number) => {
  const finalWaveform = [];

  for (let i = 0; i < width / 2; i++) {
    let maxRms = 0;
    for (let channelWaveform of waveforms) {
      if (channelWaveform) {
        const currentRms = channelWaveform[i] ? channelWaveform[i] : 0;
        if (currentRms > maxRms) {
          maxRms = currentRms;
        }
      }
    }
    finalWaveform.push(maxRms);
  }

  return finalWaveform;
};

export const useWaveformWorker = () => {
  const removeWaveform = async (index: number, onRemove: Function) => {
    WaveformStore.removeChannel(index);
    WaveformStore.updateWaveformData(false);

    reloadWaveform().then(() => onRemove());
  };

  const applyGain = async (index: number, gain: number) => {
    WaveformStore.applyChannelGain(index, gain);
    await reloadWaveform();
  };

  const updateChannelGains = async () => {
    WaveformStore.updateChannelGains();
    await reloadWaveform();
  };

  const reloadWaveform = async () => {
    const waveform = await calcFinalWaveform(WaveformStore.getChannelWaveforms(), WaveformStore.width);

    WaveformStore.setWaveform(waveform);
  };

  return {
    removeWaveform,
    reloadWaveform,
    applyGain,
    updateChannelGains,
  };
};
