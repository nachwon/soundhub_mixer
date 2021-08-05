import { useEffect, useRef, useState } from "react";
import { MIXER_STYLES } from "../../../../constants";
import { Channel } from "../../../../models/channels";
import { FaderInterface } from "../../../../types";
import VolumeMeterCanvas from "../../../volumeMeter";
import * as S from "./styles";

interface ChannelVolumeMeterCanvasProps {
  channel: FaderInterface;
}

const ChannelVolumeMeterCanvas: React.FC<ChannelVolumeMeterCanvasProps> = (props) => {
  const channel = props.channel;
  const [dBFSL, setDBFSL] = useState(-Infinity);
  const [dBFSR, setDBFSR] = useState(-Infinity);
  const [peakL, setPeakL] = useState(-Infinity);
  const [peakR, setPeakR] = useState(-Infinity);
  const [counterL, setCounterL] = useState(0);
  const [counterR, setCounterR] = useState(0);

  useEffect(() => {
    const [dBFSLeft, dBFSRight] = channel.getCurrentLevels();
    const [peakLeft, peakRight] = channel.getPeaks();
    const [counterLeft, counterRight] = channel.getCounters();
    setDBFSL(dBFSLeft);
    setDBFSR(dBFSRight);
    setPeakL(peakLeft);
    setPeakR(peakRight);
    setCounterL(counterLeft);
    setCounterR(counterRight);
  }, [channel, channel.audioCtx.currentTime]);

  return (
    <S.ChannelVolumeMeterContainer>
      <VolumeMeterCanvas
        meterWidth={MIXER_STYLES.faderWidth / 2}
        dBFS={dBFSL}
        peak={peakL}
        counter={counterL}
        position={"L"}
      />
      <VolumeMeterCanvas
        meterWidth={MIXER_STYLES.faderWidth / 2}
        dBFS={dBFSR}
        peak={peakR}
        counter={counterR}
        position={"R"}
      />
    </S.ChannelVolumeMeterContainer>
  );
};

interface ChannelFaderProps {
  channel: Channel;
}

const ChannelFader: React.FC<ChannelFaderProps> = (props) => {
  const channel = props.channel;
  const getFaderPosition = (gain: number) => {
    return (1 - gain / channel.maxGain) * 100;
  };

  const [faderPosition, setFaderPosition] = useState(getFaderPosition(1));
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
    const faderGainValue = channel.maxGain - faderPositionScaled;

    channel.setGain(faderGainValue);
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
