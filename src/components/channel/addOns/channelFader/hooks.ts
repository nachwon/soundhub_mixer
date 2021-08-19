import React, { useEffect, useRef, useState } from "react";
import { MIXER_SETTINGS } from "../../../../constants";
import { FaderInterface } from "../../../../types";
import { getScaledGainValue } from "../../../../utils";

interface useChannelFaderProps {
  channel: FaderInterface;
  pressedKey?: string;
}

const FaderMaxPercent = MIXER_SETTINGS.faderMaxPercent;
const NumberOfTicks = 15;

const defaultCalculator = (percent: number) => {
  const faderPosition = (1 - percent / FaderMaxPercent) * 100;
  const tickUnitHeightPercent = 100 / ((NumberOfTicks - 1) * 2);
  return Math.round(faderPosition / tickUnitHeightPercent) * tickUnitHeightPercent;
};

const fineTuningCalculator = (percent: number) => {
  return (1 - percent / FaderMaxPercent) * 100;
};

const snappingClaculator = (percent: number) => {
  const faderPosition = (1 - percent / FaderMaxPercent) * 100;
  const tickUnitHeightPercent = 100 / (NumberOfTicks - 1);
  return Math.round(faderPosition / tickUnitHeightPercent) * tickUnitHeightPercent;
};

const FaderPositionCalculator: { [k: string]: (percent: number) => number } = {
  default: defaultCalculator,
  ShiftLeft: fineTuningCalculator,
  MetaLeft: snappingClaculator,
};

export const useChannelFader = ({ channel, pressedKey = "default" }: useChannelFaderProps) => {
  const faderPositionCalculator = useRef<(gain: number) => number>(defaultCalculator);
  const faderRail = useRef<HTMLDivElement>(null);
  const faderHandle = useRef<HTMLDivElement>(null);
  const faderOffset = useRef(0);

  useEffect(() => {
    const calcFunc = FaderPositionCalculator[pressedKey];
    if (!calcFunc) {
      faderPositionCalculator.current = defaultCalculator;
    } else {
      faderPositionCalculator.current = calcFunc;
    }
  }, [pressedKey]);

  const handleFaderMouseDown = (e: React.MouseEvent) => {
    faderOffset.current = e.nativeEvent.offsetY;
    window.addEventListener("mousemove", handleFaderMouseMove);
    window.addEventListener("mouseup", removeGlobalFaderEvents);
  };

  const handleFaderMouseMove = (e: MouseEvent) => {
    if (!faderRail.current || !faderHandle.current) {
      return;
    }
    const railRect = faderRail.current.getBoundingClientRect();
    const faderRailTop = railRect.top;
    const faderRailHeight = railRect.height;
    const handleHeight = faderHandle.current.getBoundingClientRect().height;

    const faderPositionPx = Math.max(
      Math.min(e.pageY - faderRailTop - faderOffset.current + handleHeight / 2, faderRailHeight),
      0
    );
    const faderPositionPercent = FaderMaxPercent - (faderPositionPx * FaderMaxPercent) / faderRail.current.offsetHeight;
    const calculatedFaderPosition = calculateFaderPositionFromPercent(faderPositionPercent);
    const calculatedFaderGainValue = FaderMaxPercent - FaderMaxPercent * (calculatedFaderPosition / 100);

    channel.setGain(getScaledGainValue(calculatedFaderGainValue, channel.maxGain));
    channel.setFaderPosition(calculatedFaderPosition);
  };

  const removeGlobalFaderEvents = (e: MouseEvent) => {
    window.removeEventListener("mousemove", handleFaderMouseMove);
    window.removeEventListener("mouseup", removeGlobalFaderEvents);
  };

  const calculateFaderPositionFromPercent = (gain: number) => {
    return faderPositionCalculator.current(gain);
  };

  return {
    handleFaderMouseDown,
    faderRail,
    faderHandle,
    NumberOfTicks,
  };
};
