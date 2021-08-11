import styled, { keyframes } from "styled-components";
import Download from "../../assets/download.png";
import Reset from "../../assets/reload.png";
import soundhubIcon from "../../assets/soundhub-icon.png";
import { THEME } from "../../constants";

export const MixerActionButtonsContainer = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const MixerTitleContainer = styled.div`
  display: flex;
  width: 230px;
  justify-content: space-between;
  align-items: center;
`;

export const SoundHubIcon = styled.div`
  width: 30px;
  height: 30px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-image: url(${soundhubIcon});
`;

export const MixerTitle = styled.div`
  font-family: "Monoton";
  font-size: 18px;
  color: white;
`;

const buttonEnabled = keyframes`
10% {
  transform: scale(1.5);
}

50% {
  transform: scale(1.5) rotate(15deg);
}

60% {
  transform: scale(1.5) rotate(-15deg);
}

70% {
  transform: scale(1.5) rotate(15deg);
}

80% {
  transform: scale(1.5) rotate(-15deg);
}

85% {
  transform: scale(1.5) rotate(0deg);
}

100% {
  transform: scale(1)
}
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ButtonDivider = styled.div`
  margin: 0 5px;
  width: 1px;
  height: 15px;
  border-right: 1px solid #4e4e4e;
`;

export const DownloadButton = styled.button`
  background-image: url(${Download});
  background-color: transparent;
  background-position: center;
  background-size: 15px;
  height: 25px;
  width: 25px;
  border: 1px solid ${(props: { isLoaded: boolean }) => (props.isLoaded ? THEME.MAIN_COLOR_BLUE : "#6f6f6f")};
  border-radius: 4px;
  background-repeat: no-repeat;
  box-shadow: 1px 1px 2px 0px;
  filter: ${(props: { isLoaded: boolean }) => (props.isLoaded ? "grayscale(0)" : "grayscale(1)")};
  animation: ${(props: { isLoaded: boolean }) => (props.isLoaded ? buttonEnabled : "")} linear 1s;

  :active {
    box-shadow: 1px 1px 0px 0px;
    transform: translateY(1px);
  }
`;

export const ResetButton = styled.button`
  background-image: url(${Reset});
  background-color: transparent;
  background-position: center;
  background-size: 15px;
  height: 25px;
  width: 25px;
  border: 1px solid ${(props: { isLoaded: boolean }) => (props.isLoaded ? "#f44335" : "#6f6f6f")};
  border-radius: 4px;
  background-repeat: no-repeat;
  box-shadow: 1px 1px 2px 0px;
  filter: ${(props: { isLoaded: boolean }) => (props.isLoaded ? "grayscale(0)" : "grayscale(1)")};
  :active {
    box-shadow: 1px 1px 0px 0px;
    transform: translateY(1px);
  }
`;
