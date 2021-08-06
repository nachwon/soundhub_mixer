import styled from "styled-components";
import { THEME } from "../../constants";
import PlayImg from "../../assets/play-icon.png";
import PauseImg from "../../assets/pause-icon.png";

export const MixerControllerContainer = styled.div`
  width: 100%;
  display: inline-flex;
  margin-top: 10px;
  border-radius: 5px;
  box-shadow: inset 0 0 2px 0 black;
  padding: 5px;
  align-items: center;
  justify-content: center;
`;

export const MixerPlayButton = styled.div`
  display: inline-block;
  width: 45px;
  height: 45px;
  background-size: contain;
  background-image: url(${(props: { playing: boolean }) => (props.playing ? PauseImg : PlayImg)});
  background-position: center;
  background-repeat: no-repeat;
  flex-shrink: 0;
`;

export const MixerProgressBarContainer = styled.div`
  width: 80%;
  height: fit-content;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 10px;
`;

export const MixerProgressBarGuide = styled.div`
  width: 100%;
  height: 10px;
  border-radius: 3px;
  background: #393939;
  box-shadow: inset 1px 1px 2px 0 black;
  flex-shrink: 0;
  overflow: hidden;
  pointer-events: none;
`;

interface MixerProgressIndicatorProps {
  progress: number;
}

export const MixerProgressIndicator = styled.div.attrs<MixerProgressIndicatorProps>((props) => ({
  style: {
    width: `${props.progress}%`,
  },
}))<MixerProgressIndicatorProps>`
  height: 100%;
  background: ${THEME.MAIN_COLOR_GREEN};
  box-shadow: inset 1px 1px 4px 0 black;
  position: relative;
  pointer-events: none;
`;

interface MixerProgressPointerProps {
  position: number;
}

export const MixerProgressPointer = styled.div.attrs<MixerProgressPointerProps>((props) => ({
  style: {
    left: `${props.position}px`,
  },
}))<MixerProgressPointerProps>`
  width: 1px;
  height: 100%;
  background: #ff2929;
  display: inline-block;
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

export const MixerProgressBar = styled.div`
  width: 100%;
  height: 25px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  :hover {
    ${MixerProgressPointer} {
      opacity: 1;
    }
  }
`;

export const CurrentTimeDisplay = styled.div`
  width: 150px;
  color: ${THEME.MAIN_COLOR_BLUE};
  text-align: center;
  margin: 5px 0;
  font: 15px bold;
  background: #0d031d;
  border-radius: 3px;
  box-shadow: inset 1px 1px 1px 1px black;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  * {
    font-family: "Wallpoet", sans-serif;
  }
`;

export const TimeText = styled.div`
  width: 55px;
`;

export const Splitter = styled.div`
  border-left: 1px solid #3c1c68;
  border-right: 1px solid #290952;
  height: 19px;
  width: 1px;
  margin: 0 11px;
`;
