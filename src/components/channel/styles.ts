import styled, { keyframes } from "styled-components";
import defaultProfileImg from "../../assets/default-profile-picture.png";
import deleteButton from "../../assets/x-button.png";
import linkFile from "../../assets/link.png";
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
  align-items: center;
  justify-content: center;
  box-shadow: inset 0px 0px 4px 0 black;
  border-radius: 4px;
  background-color: #292929;
  position: relative;
  overflow: hidden;
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
  box-shadow: inset 0px 0px 7px 1px;
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

const popUp = keyframes`
0% {
  transform: scale(0)
}

80% {
  transform: scale(1.3)
}

100% {
  transform: scale(1)
}
`;

export const DeleteChannelButton = styled.button`
  position: absolute;
  right: 6px;
  bottom: 0px;
  border: 1px solid #791111;
  border-radius: 50%;
  box-shadow: 2px 2px 3px -1px black;
  width: 25px;
  height: 25px;
  background-color: transparent;
  background-image: url(${deleteButton});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  animation: ${popUp} linear 0.2s;
  :active {
    transform: translateY(1px);
    box-shadow: 1px 1px 1px -1px black;
  }
`;

export const ChannelUserInfoSection = styled.div`
  position: relative;
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
  flex-shrink: 0;
`;

export const AddChannelWithLinkModal = styled.div`
  position: absolute;
  width: 65%;
  height: 100px;
  background: #242526;
  z-index: 100;
  border-radius: 5px;
  box-shadow: 1px 1px 6px 1px black;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
`;

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const DownloadProgress = styled.div`
  :before {
    content: "";
    background: ${THEME.MAIN_COLOR_BLUE};
    width: ${(props: { progress: number }) => props.progress}%;
    height: 100%;
    position: absolute;
    transition-duration: 0.2s;
  }
  overflow: hidden;
  position: relative;
  height: 5px;
  width: 92%;
  border-radius: 5px;
`;

export const LinkIcon = styled.div`
  background-color: transparent;
  border-bottom: 1px solid #393939;
  width: 30px;
  height: 30px;
  background-size: 18px;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(${linkFile});
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 50%;
`;

const spreadOut = keyframes`
  0% {
    width: 0px;
    height: 0px;
  }

  100% {
    width: 100px;
    height: 100px;
  }
`;

export const ButtonCover = styled.div`
  display: none;
  position: absolute;
  background: ${(props) => props.color};
  position: absolute;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  animation: ${spreadOut} linear 0.2s;
`;

export const ModalButton = styled.button`
  :active {
    transform: translateY(1px);
    box-shadow: 1px 1px 1px black;
  }
  :hover {
    box-shadow: 1px 1px 3px black;
    color: ${THEME.BACKGROUND_COLOR};
    ${ButtonCover} {
      display: inline-block;
    }
  }
  position: relative;
  overflow: hidden;
  transition-duration: 0.2s;
  color: ${(props) => props.color};
  width: 80px;
  background-color: transparent;
  border: none;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const AddLinkInput = styled.input`
  color: white;
  width: 85%;
  height: 30px;
  background: transparent;
  border-radius: 0px;
  border: none;
  border-bottom: 1px solid #393939;
`;

export const ModalMask = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  position: absolute;
  background-color: #0000006e;
  z-index: 100;
`;
