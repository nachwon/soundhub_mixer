import styled from 'styled-components'
import soundhubLogo from '../../assets/soundhub-logo-w.png';


const mixerBackgroundColor = '#242526';
const channelHeight = 550;
const channelWidth = 80;
const channelTopBottomPadding = 5;
const numberOfChannels = 8;

const faderLength = 280;


export const MixerContainer = styled.div`
  user-select: none;
  height: fit-content;
  width: fit-content;
  background: ${mixerBackgroundColor};
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 10px;
  border: 2px solid silver;
  box-shadow: inset -1px -1px 3px 0px black;
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

export const ChannelsContainer = styled.div`
  height: ${channelHeight}px;
  width: ${channelWidth * numberOfChannels}px;
  display: inline-flex;
  box-shadow: inset 0px 0px 4px 0 black;
  border-radius: 4px;
  background-color: #292929;
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