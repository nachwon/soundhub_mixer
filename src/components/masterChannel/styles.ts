import styled from "styled-components"
import { FaderHandleProps } from "../../types";

const channelWidth = 80;
const faderLength = 280;


export const MasterVolumeControlContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
`;

export const MasterChannelWrapper = styled.div`
  display: inline-flex;
  flex-direction: row;
`;

export const MasterChannelInnerWrapper = styled.div`
  width: ${channelWidth - 10}px;
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
  height: ${faderLength}px;
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