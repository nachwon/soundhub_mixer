import React, { useEffect, useRef, useState } from "react";
import { MIXER_SETTINGS } from "../../../../constants";
import { Channel } from "../../../../models/channels";
import { getScaledGainValue } from "../../../../utils";

interface useChannelFaderProps {
  channel: Channel;
  pressedKey?: string;
}

const FaderMaxPosition = MIXER_SETTINGS.faderMaxPosition;
const FaderIdlePosition = MIXER_SETTINGS.faderIdlePosition;
const NumberOfTicks = 15;

const defaultCalculator = (gain: number) => {
  const faderPosition = (1 - gain / FaderMaxPosition) * 100;
  const tickUnitHeightPercent = 100 / ((NumberOfTicks - 1) * 2);
  return Math.round(faderPosition / tickUnitHeightPercent) * tickUnitHeightPercent;
};

const fineTuningCalculator = (gain: number) => {
  return (1 - gain / FaderMaxPosition) * 100;
};

const snappingClaculator = (gain: number) => {
  const faderPosition = (1 - gain / FaderMaxPosition) * 100;
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
  const [faderPosition, setFaderPosition] = useState(faderPositionCalculator.current(FaderIdlePosition));
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
    const faderPosition = Math.max(Math.min(e.pageY - faderRailTop, faderRail.current.offsetHeight), 0);
    const faderPositionScaled = ((faderPosition / faderRail.current.offsetHeight) * 140) / 100;
    const faderGainValue = FaderMaxPosition - faderPositionScaled;

    channel.setGain(getScaledGainValue(faderGainValue, channel.maxGain));
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
