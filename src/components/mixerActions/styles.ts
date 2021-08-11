import styled from "styled-components";
import Download from "../../assets/download.png";
import soundhubIcon from "../../assets/soundhub-icon.png";

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

export const DownloadButton = styled.button`
  background-image: url(${Download});
  background-color: transparent;
  background-position: center;
  background-size: 15px;
  height: 25px;
  width: 25px;
  border: 1px solid #393939;
  border-radius: 4px;
  background-repeat: no-repeat;
  box-shadow: 1px 1px 2px 0px;
  filter: ${(props: { isLoaded: boolean }) => (props.isLoaded ? "grayscale(0)" : "grayscale(1)")};
  transition-duration: 0.5s;
  :active {
    box-shadow: 1px 1px 0px 0px;
  }
`;
