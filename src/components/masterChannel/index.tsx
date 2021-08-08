import React, { useState, useEffect } from "react";
import { MasterChannel } from "../../models/channels";
import * as S from "./styles";
import { MIXER_SETTINGS } from "../../constants";
import VolumeMeterCanvas from "../volumeMeter";

import { useChannelFader } from "../channel/addOns/channelFader/hooks";

interface MasterChannelVolumeMetersProps {
  channel: MasterChannel;
}

const MasterChannelVolumeMeters: React.FC<MasterChannelVolumeMetersProps> = (props) => {
  const masterChannel = props.channel;
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
    const [dBFSL, dBFSR] = masterChannel.getCurrentLevels();
    const [peakL, peakR] = masterChannel.getPeaks();
    const [counterL, counterR] = masterChannel.getCounters();
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
  }, [masterChannel, masterChannel.audioCtx.currentTime]);

  const renderMasterTicks = () => {
    const ticksArray = [];
    for (let i = 0; i < 11; i++) {
      ticksArray.push(<S.MasterTick key={i} />);
    }
    return ticksArray;
  };

  return (
    <S.MasterChannelMeter>
      <S.MeterRail>
        <S.ChannelVolumeMeterContainer>
          <VolumeMeterCanvas meterWidth={MIXER_SETTINGS.faderWidth} {...leftMeterProps} />
        </S.ChannelVolumeMeterContainer>
        <S.MeterLabel>L</S.MeterLabel>
      </S.MeterRail>
      <S.MasterChannelMeterTicksContainer>
        <S.MasterMeterContainer>{renderMasterTicks()}</S.MasterMeterContainer>
        <S.MasterMeterCenter></S.MasterMeterCenter>
        <S.MasterMeterContainer>{renderMasterTicks()}</S.MasterMeterContainer>
      </S.MasterChannelMeterTicksContainer>
      <S.MeterRail>
        <S.ChannelVolumeMeterContainer>
          <VolumeMeterCanvas meterWidth={MIXER_SETTINGS.faderWidth} {...rightMeterProps} />
        </S.ChannelVolumeMeterContainer>
        <S.MeterLabel>R</S.MeterLabel>
      </S.MeterRail>
    </S.MasterChannelMeter>
  );
};

interface MasterChannelProps {
  masterChannel: MasterChannel;
  pressedKey?: string;
}

const MasterChannelComponent: React.FC<MasterChannelProps> = (props) => {
  const masterChannel: MasterChannel = props.masterChannel;
  const { handleFaderMouseDown, faderPosition, faderRail, NumberOfTicks } = useChannelFader({
    channel: masterChannel,
    pressedKey: props.pressedKey,
  });

  const renderTicks = () => {
    const ticksArray = [];
    for (let i = 0; i < NumberOfTicks; i++) {
      ticksArray.push(<S.FaderTick key={i} />);
    }
    return ticksArray;
  };

  return (
    <S.MasterVolumeControlContainer>
      <S.MasterChannelWrapper>
        <S.MasterChannelInnerWrapper>
          <S.FaderSection>
            <S.FaderRail ref={faderRail}>
              <S.FaderTicksContainer>{renderTicks()}</S.FaderTicksContainer>
              <S.MasterFaderHandle onMouseDown={(e) => handleFaderMouseDown(e)} position={faderPosition} />
            </S.FaderRail>
          </S.FaderSection>
          <S.MasterTrackNameSection>
            <S.MasterTrackName>Master</S.MasterTrackName>
          </S.MasterTrackNameSection>
        </S.MasterChannelInnerWrapper>
        <MasterChannelVolumeMeters channel={masterChannel} />
      </S.MasterChannelWrapper>
    </S.MasterVolumeControlContainer>
  );
};

export default MasterChannelComponent;
