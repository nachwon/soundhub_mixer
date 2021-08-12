import { observer } from "mobx-react";
import React, { ChangeEvent, useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { FileInputId } from "../../constants";
import { Channel } from "../../models/channels";
import Mixer from "../../models/mixer";
import { ChannelDto } from "../../types";
import editModeStore from "../mixerActions/store";
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
  selectedIndex?: number;
  onClick: Function;
  onFileSelect: (index: number, dto: ChannelDto) => void;
}

const EmptyChannel: React.FC<EmptyChannelProps> = (props) => {
  const setShowingIndex = props.onClick;
  const [show, setShow] = useState(false);
  const fileInputId = `${FileInputId}-${props.index}`;

  useEffect(() => {
    setShow(props.index === props.selectedIndex);
  }, [props]);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      props.onFileSelect(props.index, {
        title: files[0]?.name,
        src: files[0],
      });

      e.target.value = "";
    } else {
      return;
    }
  };

  return (
    <S.Channel>
      <input type="file" accept=".mp3,.wav" id={fileInputId} onChange={handleFileSelect} />
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
            <S.AddFileButton htmlFor={fileInputId} />
            <S.ButtonsDivider />
            <S.LinkFileButton htmlFor={fileInputId} />
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
  onDeleteChannel: Function;
}

const ChannelComponent: React.FC<ChannelComponentProps> = observer(
  ({ channel, pressedKey = "default", onDeleteChannel }) => {
    const store = editModeStore;

    return (
      <S.Channel>
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
      </S.Channel>
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
          <ChannelComponent
            key={index}
            channel={channel}
            pressedKey={props.pressedKey}
            onDeleteChannel={handleChannelDelete}
          />
        );
      } else {
        return (
          <EmptyChannel
            key={index}
            index={index}
            selectedIndex={selectedIndex}
            onClick={setSelectedIndex}
            onFileSelect={mixer.addChannel.bind(mixer)}
          />
        );
      }
    });
  };

  return <S.ChannelsContainer>{renderChannels()}</S.ChannelsContainer>;
});

export default ChannelsContainer;
