import React, { useState, useRef } from 'react'
import { MasterChannel } from "../../models/channels"
import * as S from "./styles";


interface MasterChannelProps {
  masterChannel: MasterChannel
}

const MasterChannelComponent: React.FC<MasterChannelProps> = (props) => {
  const masterChannel: MasterChannel = props.masterChannel;
  const getFaderPosition = (gain: number) => {
    return (1 - gain / masterChannel.maxGain) * 100;
  }

  const [faderPosition, setFaderPosition] = useState(getFaderPosition(1))
  const faderRail = useRef<HTMLDivElement>(null);

  const renderTicks = () => {
    const ticksArray = [];
    for (let i = 0; i < 15; i++) {
      ticksArray.push(<S.FaderTick key={i} />);
    }
    return ticksArray;
  };

  const handleFaderMouseDown = (e: React.MouseEvent) => {
    window.addEventListener('mousemove', handleFaderMouseMove);
    window.addEventListener('mouseup', removeGlobalFaderEvents);
  };

  const handleFaderMouseMove = (e: MouseEvent) => {
    if (!faderRail.current) {
      return
    } 
    const rect = faderRail.current.getBoundingClientRect()
    const faderRailTop = rect.top
    const faderPosition = Math.max(Math.min(e.pageY - faderRailTop, faderRail.current.offsetHeight), 0);
    const faderPositionScaled = ((faderPosition / faderRail.current.offsetHeight) * 140) / 100;
    const faderGainValue = masterChannel.maxGain - faderPositionScaled;

    masterChannel.setGain(faderGainValue);
    setFaderPosition(getFaderPosition(faderGainValue))
  };

  const removeGlobalFaderEvents = (e: MouseEvent) => {
    window.removeEventListener('mousemove', handleFaderMouseMove);
    window.removeEventListener('mouseup', removeGlobalFaderEvents);
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
        </S.MasterChannelInnerWrapper>
      </S.MasterChannelWrapper>
    </S.MasterVolumeControlContainer>
  )
}

export default MasterChannelComponent