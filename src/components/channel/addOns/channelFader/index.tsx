import { useEffect, useRef, useState } from "react";
import { MIXER_SETTINGS } from "../../../../constants";
import { Channel } from "../../../../models/channels";
import { FaderInterface } from "../../../../types";
import { getScaledGainValue } from "../../../../utils";
import VolumeMeterCanvas from "../../../volumeMeter";
import * as S from "./styles";

interface ChannelVolumeMeterCanvasProps {
  channel: FaderInterface;
}

const ChannelVolumeMeterCanvas: React.FC<ChannelVolumeMeterCanvasProps> = (props) => {
  const channel = props.channel;
  const [leftMeterProps, setLeftMeterProps] = useState({
    dBFS: -Infinity,
    peak: -Infinity,
    counter: 0,
  });
  const [rightMeterProps, setRightMeterProps] = useState({
    dBFS: -Infinity,
    peak: -Infinity,
    counter: 0,
  });

  useEffect(() => {
    const [dBFSL, dBFSR] = channel.getCurrentLevels();
    const [peakL, peakR] = channel.getPeaks();
    const [counterL, counterR] = channel.getCounters();

    setLeftMeterProps({
      dBFS: dBFSL,
      peak: peakL,
      counter: counterL,
    });
    setRightMeterProps({
      dBFS: dBFSR,
      peak: peakR,
      counter: counterR,
    });
  }, [channel, channel.audioCtx.currentTime]);

  const faderWidth = MIXER_SETTINGS.faderWidth / 2;

  return (
    <S.ChannelVolumeMeterContainer>
      <VolumeMeterCanvas meterWidth={faderWidth} position={"L"} {...leftMeterProps} />
      <VolumeMeterCanvas meterWidth={faderWidth} position={"R"} {...rightMeterProps} />
    </S.ChannelVolumeMeterContainer>
  );
};

interface ChannelFaderProps {
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

const ChannelFader: React.FC<ChannelFaderProps> = ({ channel, pressedKey = "default" }) => {
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

  const renderTicks = () => {
    const ticksArray = [];
    for (let i = 0; i < NumberOfTicks; i++) {
      ticksArray.push(<S.FaderTick key={i} />);
    }
    return ticksArray;
  };

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

  return (
    <S.FaderSection>
      <S.FaderRail ref={faderRail}>
        <S.FaderTicksContainer>{renderTicks()}</S.FaderTicksContainer>
        <S.FaderHandle onMouseDown={(e) => handleFaderMouseDown(e)} position={faderPosition} />
        <ChannelVolumeMeterCanvas channel={channel} />
      </S.FaderRail>
    </S.FaderSection>
  );
};

export default ChannelFader;
