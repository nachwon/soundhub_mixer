import { useEffect, useState } from "react";
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

  const renderTicks = () => {
    const ticksArray = [];
    for (let i = 0; i < 15; i++) {
      ticksArray.push(<S.FaderTick key={i} />);
    }
    return ticksArray;
  };

  return (
    <S.FaderSection>
      <S.FaderRail>
        <S.FaderTicksContainer>{renderTicks()}</S.FaderTicksContainer>
        <S.FaderHandle onMouseDown={() => {}} position={0} />
        <ChannelVolumeMeterCanvas channel={channel} />
      </S.FaderRail>
    </S.FaderSection>
  );
};

export default ChannelFader;
