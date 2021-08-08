import { useEffect, useState } from "react";
import { MIXER_SETTINGS } from "../../../../constants";
import { Channel } from "../../../../models/channels";
import { FaderInterface } from "../../../../types";
import VolumeMeterCanvas from "../../../volumeMeter";
import { useChannelFader } from "./hooks";
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

const ChannelFader: React.FC<ChannelFaderProps> = ({ channel, pressedKey = "default" }) => {
  const { handleFaderMouseDown, faderPosition, faderRail, NumberOfTicks } = useChannelFader({ channel, pressedKey });
  const renderTicks = () => {
    const ticksArray = [];
    for (let i = 0; i < NumberOfTicks; i++) {
      ticksArray.push(<S.FaderTick key={i} />);
    }
    return ticksArray;
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
