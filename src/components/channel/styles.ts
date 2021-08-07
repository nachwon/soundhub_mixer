import styled, { keyframes } from "styled-components";
import defaultProfileImg from "../../assets/default-profile-picture.png";
import { MIXER_SETTINGS, THEME } from "../../constants";

export const Channel = styled.div`
  height: ${MIXER_SETTINGS.channelHeight}px;
  width: ${MIXER_SETTINGS.channelWidth}px;
  display: inline-flex;
  padding: 5px;
`;

export const ChannelsContainer = styled.div`
  height: ${MIXER_SETTINGS.channelHeight}px;
  width: ${MIXER_SETTINGS.channelWidth * MIXER_SETTINGS.numberOfChannels}px;
  display: inline-flex;
  box-shadow: inset 0px 0px 4px 0 black;
  border-radius: 4px;
  background-color: #292929;
`;

export const ChannelInnerWrapper = styled.div`
  position: relative;
  height: ${MIXER_SETTINGS.channelHeight - MIXER_SETTINGS.channelTopBottomPadding * 2}px;
  width: ${MIXER_SETTINGS.channelWidth - 10}px;
  background: #222222;
  display: inline-flex;
  padding: 5px 0;
  flex-direction: column;
  border-radius: 5px;
  box-shadow: inset 1px 1px 3px 0px black;
`;

export const ChannelUserProfileImg = styled.div`
  height: 50px;
  width: 50px;
  background: #3c3c3c;
  border-radius: 50%;
  background-image: url(${(props: { src?: string }) => (props.src ? props.src : defaultProfileImg)});
  background-size: ${(props: { src?: string }) => (props.src ? "cover" : "90%")};
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid #333333; ;
`;

export const SpinnerContainer = styled.div`
  width: 50px;
  height: 50px;
  background: transparent;
  border-radius: 50%;
  z-index: 100;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const ChannelLoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  background: transparent;
  border-radius: 50px;
  animation: ${rotate} 1s linear infinite;
  border: 7px solid transparent;
  border-bottom: 7px solid ${THEME.MAIN_COLOR_BLUE};
`;

export const LoadingMask = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: #1212128a;
  z-index: 100;
  top: 0;
  border-radius: 5px;
`;

export const ChannelUserInfoSection = styled.div`
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
  flex-shrink: 0;
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
`;

export const EmptyChannelInner = styled.div`
  font-family: "Wallpoet";
  border-radius: 5px;
  border: 1px dashed #404040;
  width: 90%;
  height: 100%;
  display: inline-flex;
  text-orientation: sideways-right;
  writing-mode: vertical-rl;
  font-size: 25px;
  font-weight: 900;
  justify-content: center;
  align-items: center;
  text-shadow: 0px 1px 0px rgba(255, 255, 255, 0.1);
  color: #1a1a1a;
`;
