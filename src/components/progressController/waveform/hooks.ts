import { useWorker } from "@koale/useworker";
import { WaveformStore } from "../../../stores";
import { calcFinalWaveform } from "../../../utils";

export const useWaveformWorker = () => {
  const [updateWaveformWorker] = useWorker(calcFinalWaveform);

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
    const waveform = await updateWaveformWorker(WaveformStore.getChannelWaveforms(), WaveformStore.width);

    WaveformStore.setWaveform(waveform);
  };

  return {
    removeWaveform,
    reloadWaveform,
    applyGain,
    updateChannelGains,
  };
};
