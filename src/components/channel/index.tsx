import { observer } from "mobx-react";
import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Channel } from "../../models/channels";
import Mixer from "../../models/mixer";
import editModeStore from "../../stores/editModeStore";
import EmptyChannel from "../emptyChannel";
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

interface ChannelComponentProps {
  channel: Channel;
  pressedKey?: string;
  onDeleteChannel: Function;
}

const ChannelComponent: React.FC<ChannelComponentProps> = observer(
  ({ channel, pressedKey = "default", onDeleteChannel }) => {
    const store = editModeStore;

    return (
      <S.ChannelInnerWrapper>
        {channel.loaded ? null : <S.LoadingMask />}
        <S.ChannelUserInfoSection>
          {channel.loaded ? <S.ChannelUserProfileImg /> : <LoadingSpinner />}
          {channel.loaded && store.isEditing ? (
            <S.DeleteChannelButton onClick={() => onDeleteChannel(channel)} />
          ) : null}
        </S.ChannelUserInfoSection>
        <MuteSoloComponent channel={channel} />
        <Panner channel={channel} pressedKey={pressedKey} />
        <ChannelFader channel={channel} pressedKey={pressedKey} />
        <ChannelName channel={channel} />
      </S.ChannelInnerWrapper>
    );
  }
);

interface ChannelsContainerProps {
  mixer: Mixer;
  pressedKey?: string;
}

const ChannelsContainer: React.FC<ChannelsContainerProps> = observer((props) => {
  const mixer = props.mixer;
  const channelsRef = useRef(mixer.channels);
  const channels = channelsRef.current;
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();

  useEffect(() => {
    const eventHandler = (e: MouseEvent) => {
      e.stopPropagation();
      setSelectedIndex(undefined);
    };
    window.addEventListener("click", eventHandler);
    return () => window.removeEventListener("click", eventHandler);
  }, []);

  useEffect(() => {
    if (props.pressedKey === "Escape") {
      editModeStore.turnOffEditMode();
    }
  }, [props.pressedKey]);

  const handleChannelDelete = (channel: Channel) => {
    mixer.removeChannel(channel.index);
    if (!mixer.channelsLoaded) {
      editModeStore.turnOffEditMode();
    }
  };

  const renderChannels = () => {
    return channels.map((channel, index) => {
      if (channel) {
        return (
          <S.Channel>
            <ChannelComponent
              key={index}
              channel={channel}
              pressedKey={props.pressedKey}
              onDeleteChannel={handleChannelDelete}
            />
          </S.Channel>
        );
      } else {
        return (
          <S.Channel>
            <EmptyChannel
              key={index}
              index={index}
              selectedIndex={selectedIndex}
              onClick={setSelectedIndex}
              onFileSelect={mixer.addChannel.bind(mixer)}
            />
          </S.Channel>
        );
      }
    });
  };

  return <S.ChannelsContainer>{renderChannels()}</S.ChannelsContainer>;
});

export default ChannelsContainer;
