import React, { useEffect, useRef, useState } from "react";
import { MIXER_SETTINGS } from "../../../../constants";
import { FaderInterface } from "../../../../types";
import { getScaledGainValue } from "../../../../utils";

interface useChannelFaderProps {
  channel: FaderInterface;
  pressedKey?: string;
}

const FaderMaxPercent = MIXER_SETTINGS.faderMaxPercent;
const FaderIdlePercent = MIXER_SETTINGS.faderIdlePercent;
const NumberOfTicks = 15;

const defaultCalculator = (gain: number) => {
  const faderPosition = (1 - gain / FaderMaxPercent) * 100;
  const tickUnitHeightPercent = 100 / ((NumberOfTicks - 1) * 2);
  return Math.round(faderPosition / tickUnitHeightPercent) * tickUnitHeightPercent;
};

const fineTuningCalculator = (gain: number) => {
  return (1 - gain / FaderMaxPercent) * 100;
};

const snappingClaculator = (gain: number) => {
  const faderPosition = (1 - gain / FaderMaxPercent) * 100;
  const tickUnitHeightPercent = 100 / (NumberOfTicks - 1);
  return Math.round(faderPosition / tickUnitHeightPercent) * tickUnitHeightPercent;
};

const FaderPositionCalculator: { [k: string]: (gain: number) => number } = {
  default: defaultCalculator,
  ShiftLeft: fineTuningCalculator,
  MetaLeft: snappingClaculator,
};

export const useChannelFader = ({ channel, pressedKey = "default" }: useChannelFaderProps) => {
  const faderPositionCalculator = useRef<(gain: number) => number>(defaultCalculator);
  const [faderPosition, setFaderPosition] = useState(faderPositionCalculator.current(FaderIdlePercent));
  const faderRail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calcFunc = FaderPositionCalculator[pressedKey];
    if (!calcFunc) {
      faderPositionCalculator.current = defaultCalculator;
    } else {
      faderPositionCalculator.current = calcFunc;
    }
  }, [pressedKey]);

  const handleFaderMouseDown = (e: React.MouseEvent) => {
    window.addEventListener("mousemove", handleFaderMouseMove);
    window.addEventListener("mouseup", removeGlobalFaderEvents);
  };

  const handleFaderMouseMove = (e: MouseEvent) => {
    if (!faderRail.current) {
      return;
    }
    const rect = faderRail.current.getBoundingClientRect();
    const faderRailTop = rect.top;
    const faderPositionPx = Math.max(Math.min(e.pageY - faderRailTop, faderRail.current.offsetHeight), 0);
    const faderGainValue = FaderMaxPercent - (faderPositionPx * FaderMaxPercent) / faderRail.current.offsetHeight;
    const calculatedFaderPosition = faderPositionCalculator.current(faderGainValue);
    const calculatedFaderGainValue = FaderMaxPercent - FaderMaxPercent * (calculatedFaderPosition / 100);

    channel.setGain(getScaledGainValue(calculatedFaderGainValue, channel.maxGain));
    setFaderPosition(faderPositionCalculator.current(faderGainValue));
  };

  const removeGlobalFaderEvents = (e: MouseEvent) => {
    window.removeEventListener("mousemove", handleFaderMouseMove);
    window.removeEventListener("mouseup", removeGlobalFaderEvents);
  };

  return {
    handleFaderMouseDown,
    faderPosition,
    faderRail,
    NumberOfTicks,
  };
};
