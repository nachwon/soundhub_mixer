import styled from "styled-components"
import { FaderHandleProps } from "../../types";
import { MIXER_STYLES } from "../../constants"


export const MasterVolumeControlContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
`;

export const MasterChannelWrapper = styled.div`
  display: inline-flex;
  flex-direction: row;
`;

export const MasterChannelInnerWrapper = styled.div`
  width: ${MIXER_STYLES.channelWidth - 10}px;
  display: inline-flex;
  padding: 5px 0;
  flex-direction: column;
`;

export const FaderSection = styled.div`
  width: 100%;
  height: 350px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

export const FaderRail = styled.div`
  width: 10px;
  height: ${MIXER_STYLES.faderLength}px;
  background: #111111;
  border-radius: 2px;
  position: relative;
  display: inline-flex;
  justify-content: center;
  box-shadow: inset 2px 2px 2px 0 black;
`;

export const FaderTicksContainer = styled.div`
  height: 280px;
  width: 20px;
  position: absolute;
  left: -20px;
  top: -1px;
`;

export const FaderTick = styled.div`
  height: 1px;
  width: 8px;
  background: #5f5f5f;
  margin-bottom: 19px;

  :nth-child(5) {
    width: 20px;
    background: white;
  }
  :last-child {
    margin-bottom: 0;
  }
`;


export const MasterFaderHandle = styled.div.attrs<FaderHandleProps>((props) => ({
  style: {
    top: `${props.position}%`,
  },
}))<FaderHandleProps>`
  width: 25px;
  height: 50px;

  box-shadow: 7px 4px 7px 1px black;
  position: absolute;
  transform: translateY(-50%);
  border-radius: 1px;
  background: linear-gradient(
    180deg,
    #c02727 10%,
    #490303 4%,
    #8b3232 48%,
    white 4%,
    #5c1717 52%,
    #ff4747 89%,
    #3d0303 90%
  );
`;

export const MasterTrackNameSection = styled.div`
  border-radius: 2px;
  width: 100%;
  height: 28px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

export const MasterTrackName = styled.div`
  width: 90%;
  height: 90%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  font-size: 13px;
  font-weight: 700;
  font-size: 14px;
  color: white;
  text-shadow: 0px 0px 2px black;
`;

export const MasterChannelMeter = styled.div`
  display: inline-flex;
  width: 50px;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0px;
  height: 350px;
`;

export const MeterLabel = styled.div`
  color: white;
  position: absolute;
  bottom: -20px;
  font-size: 13px;
`;

export const MasterChannelMeterTicksContainer = styled.div`
  width: 30px;
  height: 280px;
  display: inline-flex;
`;

export const MasterMeterContainer = styled.div`
  width: 20%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

export const MasterMeterCenter = styled.div`
  width: 60%;
  height: 100%;
  border-left: 1px solid #5f5f5f;
  border-right: 1px solid #5f5f5f;
`;

export const MasterTick = styled.div`
  width: 100%;
  height: 1px;
  background: #5f5f5f;
  margin-bottom: calc(279px / 10 - 1px);

  :last-child {
    margin-bottom: 0;
  }
`;


// Volume Meter
export const ChannelVolumeMeterContainer = styled.div`
  width: 10px;
  height: 280px;
  border-radius: 2px;
  overflow: hidden;
  position: relative;
`;

export const ChannelVolumeMeter = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 10px;
  height: 280px;
`;