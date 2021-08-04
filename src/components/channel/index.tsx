import React from "react";
import { MaxChannelCount } from "../../constants";
import { Channel } from "../../models/channels";
import MuteSoloComponent from "./addOns/muteSolo/muteSolo";
import Panner from "./addOns/panner";
import * as S from "./styles";

const LoadingSpinner: React.FC = () => {
  return (
    <S.SpinnerContainer>
      <S.ChannelLoadingSpinner></S.ChannelLoadingSpinner>
    </S.SpinnerContainer>
  );
};

const EmptyChannel: React.FC = () => {
  return (
    <S.Channel>
      <S.EmptyChannel>
        <S.EmptyChannelInner>SOUNDHUB</S.EmptyChannelInner>
      </S.EmptyChannel>
    </S.Channel>
  );
};

interface ChannelComponentProps {
  channel: Channel;
}

const ChannelComponent: React.FC<ChannelComponentProps> = (props) => {
  const channel = props.channel;
  return (
    <S.Channel>
      <S.ChannelInnerWrapper>
        {channel.loaded ? null : <S.LoadingMask />}
        <S.ChannelUserInfoSection>
          {channel.loaded ? <S.ChannelUserProfileImg /> : <LoadingSpinner />}
        </S.ChannelUserInfoSection>
        <MuteSoloComponent channel={channel} />
        <Panner channel={channel} />
      </S.ChannelInnerWrapper>
    </S.Channel>
  );
};

interface ChannelsContainerProps {
  channels: Array<Channel>;
}

const ChannelsContainer: React.FC<ChannelsContainerProps> = (props) => {
  const channels = props.channels.concat(Array(MaxChannelCount - props.channels.length));

  const renderChannels = () => {
    const children = [];
    for (let i = 0; i < channels.length; i++) {
      children.push(channels[i] ? <ChannelComponent key={i} channel={channels[i]} /> : <EmptyChannel key={i} />);
    }
    return children;
  };

  return <S.ChannelsContainer>{renderChannels()}</S.ChannelsContainer>;
};

export default ChannelsContainer;
