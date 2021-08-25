import { useWorker } from "@koale/useworker";
import { toJS } from "mobx";
import { WaveformStore } from "../../../stores";
import { calcFinalWaveform } from "../../../utils";

export const useWaveformWorker = () => {
  const [updateWaveformWorker] = useWorker(calcFinalWaveform);

  const removeWaveform = async (index: number, onRemove: Function) => {
    WaveformStore.removeChannel(index);
    WaveformStore.updateWaveformData(false);

    reloadWaveform().then(() => onRemove());
  };

  const applayGain = async (index: number, gain: number) => {
    WaveformStore.applyChannelGain(index, gain);
    await reloadWaveform();
  };

  const reloadWaveform = async () => {
    const waveform = await updateWaveformWorker(
      WaveformStore.channelWaveforms.map((value: Array<number>) => toJS(value)),
      WaveformStore.width
    );

    WaveformStore.setWaveform(waveform);
  };

  return {
    removeWaveform,
    applayGain,
    reloadWaveform,
  };
};
