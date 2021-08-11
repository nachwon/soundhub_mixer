import styled from "styled-components";
import soundhubLogo from "../../assets/soundhub-logo.png";
import { MIXER_SETTINGS } from "../../constants";

export const MixerContainer = styled.div`
  user-select: none;
  height: fit-content;
  width: fit-content;
  background: ${MIXER_SETTINGS.mixerBackgroundColor};
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 10px;
  border: 2px solid silver;
  box-shadow: inset -1px -1px 3px 0px black;
  box-shadow: 1px 1px 20px 8px #737373;
  padding: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const MixerInnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
`;

export const MasterChannelContainer = styled.div`
  justify-content: center;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  border-radius: 5px;
  padding: 5px;
  border: 1px solid #5d5d5d;
  margin-left: 10px;
  box-shadow: inset 1px 1px 3px 0 black;
  height: ${MIXER_SETTINGS.channelHeight}px;
`;

export const SoundHubLogo = styled.div`
  width: 160px;
  height: 150px;
  border-bottom: 1px solid #3d3d3d;
  background-image: url(${soundhubLogo});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;
