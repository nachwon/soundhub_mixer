import { MIXER_STYLES } from "../constants";

export * from "./bufferExtractor";
export * from "./toDBFS";

export const dBFSToMeterHeight = (dBFS: number) => {
  return ((-dBFS - 48) * MIXER_STYLES.faderLength) / -48;
};
