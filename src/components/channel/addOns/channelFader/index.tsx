import { observer } from "mobx-react";
import { useEffect, useRef, useState } from "react";
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
  const anmiationRef = useRef(0);
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
    const updateMeters = () => {
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
      anmiationRef.current = requestAnimationFrame(updateMeters);
    };

    anmiationRef.current = requestAnimationFrame(updateMeters);

    return () => cancelAnimationFrame(anmiationRef.current);
  }, [channel]);

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

const ChannelFader: React.FC<ChannelFaderProps> = observer(({ channel, pressedKey = "default" }) => {
  const { handleFaderMouseDown, faderRail, NumberOfTicks } = useChannelFader({ channel, pressedKey });
  const [faderPosition, setFaderPosition] = useState(0);
  const renderTicks = () => {
    const ticksArray = [];
    for (let i = 0; i < NumberOfTicks; i++) {
      ticksArray.push(<S.FaderTick key={i} />);
    }
    return ticksArray;
  };

  useEffect(() => {
    setFaderPosition(channel.faderPosition);
  }, [channel.faderPosition]);

  return (
    <S.FaderSection>
      <S.FaderRail ref={faderRail}>
        <S.FaderTicksContainer>{renderTicks()}</S.FaderTicksContainer>
        <S.FaderHandle onMouseDown={(e) => handleFaderMouseDown(e)} position={faderPosition} />
        <ChannelVolumeMeterCanvas channel={channel} />
      </S.FaderRail>
    </S.FaderSection>
  );
});

export default ChannelFader;
