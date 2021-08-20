import styled from "styled-components";
import { THEME } from "../../constants";
import PlayImg from "../../assets/play-icon.png";
import PauseImg from "../../assets/pause-icon.png";
import StopButton from "../../assets/stop.png";

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
  cursor: pointer;
`;

export const MixerStopButton = styled.div`
  display: inline-block;
  width: 30px;
  height: 30px;
  margin: 0 10px;
  background-size: contain;
  background-image: url(${StopButton});
  background-position: center;
  background-repeat: no-repeat;
  flex-shrink: 0;
  cursor: pointer;
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
  height: 40px;
  border-radius: 3px;
  background: #1b1b1b;
  box-shadow: inset 1px 1px 4px 0 black;
  flex-shrink: 0;
  overflow: hidden;
  pointer-events: none;
  position: relative;
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
  z-index: 2;
  background: #4cf7cf2e;
  box-shadow: inset 1px 1px 4px 0 black;
  position: relative;
  pointer-events: none;
  border-right: 1px solid ${THEME.MAIN_COLOR_GREEN};
`;

interface MixerProgressPointerProps {
  position: string;
}

export const MixerProgressPointer = styled.div.attrs<MixerProgressPointerProps>((props) => ({
  style: {
    width: `${props.position}`,
  },
}))<MixerProgressPointerProps>`
  height: 100%;
  background: #4cf7cf2e;
  display: inline-block;
  position: absolute;
  pointer-events: none;
  box-shadow: inset 1px 1px 4px 0 black;
`;

export const MixerProgressBar = styled.div`
  width: 100%;
  height: 50px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
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
