import { observer } from "mobx-react";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { FileInputId, MaxChannelCount } from "../../constants";
import { Channel } from "../../models/channels";
import ChannelFader from "./addOns/channelFader";
import ChannelName from "./addOns/channelName";
import MuteSoloComponent from "./addOns/muteSolo";
import Panner from "./addOns/panner";
import * as S from "./styles";

const LoadingSpinner: React.FC = () => {
  return (
    <S.SpinnerContainer>
      <S.ChannelLoadingSpinner />
    </S.SpinnerContainer>
  );
};

interface EmptyChannelProps {
  index: number;
  showingIndex?: number;
  onClick: Function;
}

const EmptyChannel: React.FC<EmptyChannelProps> = (props) => {
  const setShowingIndex = props.onClick;
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(props.index === props.showingIndex);
  }, [props]);

  return (
    <S.Channel>
      <S.EmptyChannel
        onClick={(e) => {
          e.stopPropagation();
          setShowingIndex(props.index);
        }}
      >
        {show ? (
          <S.AddChannelButtonsContainer
            onClick={(e) => {
              e.stopPropagation();
              setShowingIndex(undefined);
            }}
          >
            <S.AddFileButton htmlFor={FileInputId} />
            <S.ButtonsDivider />
            <S.LinkFileButton htmlFor={FileInputId} />
          </S.AddChannelButtonsContainer>
        ) : null}

        <S.EmptyChannelInner>SOUNDHUB</S.EmptyChannelInner>
      </S.EmptyChannel>
    </S.Channel>
  );
};

interface ChannelComponentProps {
  channel: Channel;
  pressedKey?: string;
}

const ChannelComponent: React.FC<ChannelComponentProps> = observer(({ channel, pressedKey = "default" }) => {
  return (
    <S.Channel>
      <S.ChannelInnerWrapper>
        {channel.loaded ? null : <S.LoadingMask />}
        <S.ChannelUserInfoSection>
          {channel.loaded ? <S.ChannelUserProfileImg /> : <LoadingSpinner />}
        </S.ChannelUserInfoSection>
        <MuteSoloComponent channel={channel} />
        <Panner channel={channel} pressedKey={pressedKey} />
        <ChannelFader channel={channel} pressedKey={pressedKey} />
        <ChannelName channel={channel} />
      </S.ChannelInnerWrapper>
    </S.Channel>
  );
});

interface ChannelsContainerProps {
  channels: Array<Channel>;
  pressedKey?: string;
}

const ChannelsContainer: React.FC<ChannelsContainerProps> = observer((props) => {
  const channels = props.channels.concat(Array(MaxChannelCount - props.channels.length));
  const [showingIndex, setShowingIndex] = useState<number | undefined>();

  useEffect(() => {
    const eventHandler = (e: MouseEvent) => {
      e.stopPropagation();
      setShowingIndex(undefined);
    };
    window.addEventListener("click", eventHandler);
    return () => window.removeEventListener("click", eventHandler);
  }, []);

  const renderChannels = () => {
    const children = [];
    for (let i = 0; i < channels.length; i++) {
      children.push(
        channels[i] ? (
          <ChannelComponent key={i} channel={channels[i]} pressedKey={props.pressedKey} />
        ) : (
          <EmptyChannel key={i} index={i} showingIndex={showingIndex} onClick={setShowingIndex} />
        )
      );
    }
    return children;
  };

  return <S.ChannelsContainer>{renderChannels()}</S.ChannelsContainer>;
});

export default ChannelsContainer;
