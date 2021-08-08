import styled from "styled-components";
import { MIXER_SETTINGS } from "../../../../constants";

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
  height: ${MIXER_SETTINGS.faderLength}px;
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

interface FaderHandleProps {
  position: number;
}

export const FaderHandle = styled.div.attrs<FaderHandleProps>((props) => ({
  style: {
    top: `${props.position}%`,
  },
}))<FaderHandleProps>`
  width: 25px;
  height: 50px;
  background: linear-gradient(
    180deg,
    #2b2b2b 0%,
    #4e4e4e 10%,
    #080808 4%,
    #333333 48%,
    white 4%,
    #333333 52%,
    dimgrey 89%,
    #232323 90%,
    #0e0e0e 100%
  );
  box-shadow: 7px 4px 7px 1px black;
  position: absolute;
  transform: translateY(-50%);
  border-radius: 1px;
  z-index: 1;
`;

export const ChannelVolumeMeterContainer = styled.div`
  width: 10px;
  height: 280px;
  border-radius: 2px;
  overflow: hidden;
  position: relative;
`;
