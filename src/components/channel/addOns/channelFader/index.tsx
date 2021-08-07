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
}

const FaderMaxPosition = MIXER_SETTINGS.faderMaxPosition;
const FaderIdlePosition = MIXER_SETTINGS.faderIdlePosition;

const ChannelFader: React.FC<ChannelFaderProps> = (props) => {
  const channel = props.channel;
  const getFaderPosition = (gain: number) => {
    return (1 - gain / FaderMaxPosition) * 100;
  };

  const [faderPosition, setFaderPosition] = useState(getFaderPosition(FaderIdlePosition));
  const faderRail = useRef<HTMLDivElement>(null);

  const renderTicks = () => {
    const ticksArray = [];
    for (let i = 0; i < 15; i++) {
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
    setFaderPosition(getFaderPosition(faderGainValue));
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
