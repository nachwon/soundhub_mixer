import styled, { keyframes } from "styled-components";
import musicFile from "../../assets/music-file.png";
import linkFile from "../../assets/link.png";
import { MIXER_SETTINGS, THEME } from "../../constants";

const slideIn = keyframes`
  from {
    height: 0px;
  }
  to {
    height: 35px;
  }
`;

export const AddFileButton = styled.label`
  border-radius: 5px;
  height: 35px;
  width: 35px;
  background-size: 25px;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${musicFile});
  opacity: 1;
  -webkit-transition-duration: 0.2s;
  transition-duration: 0.2s;
  cursor: pointer;
  animation: ${slideIn} linear 0.2s;
  transition-duration: 0.2s;
`;

export const LinkFileButton = styled.div`
  border-radius: 5px;
  height: 35px;
  width: 35px;
  background-size: 25px;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${linkFile});
  opacity: 1;
  -webkit-transition-duration: 0.2s;
  transition-duration: 0.2s;
  cursor: pointer;
  animation: ${slideIn} linear 0.2s;
  transition-duration: 0.2s;
`;

const expend = keyframes`
  from {
    width: 0%;
  }
  to {
    width: 35%;
  }
`;

export const ButtonsDivider = styled.div`
  height: 1px;
  width: 35%;
  margin: 5px 0;
  background-color: ${THEME.MAIN_COLOR_GREEN};
  animation: ${expend} linear 0.2s;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    border-color: #232626;
    box-shadow: 0px 0px 0px 0px ${THEME.MAIN_COLOR_GREEN};
  }
  to {
    opacity: 1;
    border-color: ${THEME.MAIN_COLOR_GREEN};
    box-shadow: 0px 0px 11px 0px #4cf7cf78;
  }
`;

export const AddChannelButtonsContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #00000070;
  border-radius: 5px;
  animation: ${fadeIn} linear 0.3s;
  border: 1px solid ${THEME.MAIN_COLOR_GREEN};
  box-shadow: 0px 0px 11px 0px #4cf7cf78;
  cursor: auto;
`;

export const EmptyChannel = styled.div`
  height: ${MIXER_SETTINGS.channelHeight - MIXER_SETTINGS.channelTopBottomPadding * 2}px;
  width: ${MIXER_SETTINGS.channelWidth - 10}px;
  background: linear-gradient(45deg, #222222 45%, #2a2a2a 100%);
  display: inline-flex;
  padding: 5px 0;
  flex-direction: column;
  border-radius: 5px;
  box-shadow: 0 0 3px 0px black;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  transition-duration: 0.2s;
  :hover {
    border: 1px solid #4cf7cf;
  }
`;

export const EmptyChannelInner = styled.div`
  border-radius: 5px;
  border: 1px dashed #404040;
  width: 90%;
  height: 100%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: #1a1a1a;
`;

export const EmptyChannelTextContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  height: 42%;
  width: 100%;
`;

export const EmptyChannelText = styled.div`
  display: block;
  font-family: "Montserrat";
  font-size: 30px;
  writing-mode: vertical-rl;
  text-shadow: 0px 1px 0px rgba(255, 255, 255, 0.1);
`;

export const EmptyChannelNumberText = styled.div`
  display: block;
  font-family: "Montserrat";
  font-size: 30px;
  text-shadow: 0px 1px 0px rgba(255, 255, 255, 0.1);
`;
