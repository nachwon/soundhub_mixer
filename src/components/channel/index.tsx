import { observer } from "mobx-react";
import React, { useRef } from "react";
import { MouseEventHandler } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { THEME } from "../../constants";
import { Channel } from "../../models/channels";
import Mixer from "../../models/mixer";
import { AddFileLinkModalStore, EditModeStore } from "../../stores";
import EmptyChannel from "../emptyChannel";
import { useWaveform } from "../progressController/waveform/hooks";
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
    const store = EditModeStore;
    const { removeWaveform } = useWaveform();

    const hnadleChannelDelete = async () => {
      await removeWaveform(channel.index, () => onDeleteChannel(channel));
    };

    return (
      <S.ChannelInnerWrapper>
        {channel.loaded ? null : <S.LoadingMask />}
        <S.ChannelUserInfoSection>
          {channel.loaded ? <S.ChannelUserProfileImg /> : <LoadingSpinner />}
          {channel.loaded && store.isEditing ? <S.DeleteChannelButton onClick={hnadleChannelDelete} /> : null}
        </S.ChannelUserInfoSection>
        <MuteSoloComponent channel={channel} />
        <Panner channel={channel} pressedKey={pressedKey} />
        <ChannelFader channel={channel} pressedKey={pressedKey} />
        <ChannelName channel={channel} />
      </S.ChannelInnerWrapper>
    );
  }
);

interface ModalButtonProps {
  color: string;
  icon: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const ModalButton: React.FC<ModalButtonProps> = (props) => {
  return (
    <S.ModalButton color={props.color} onClick={props.onClick}>
      <span style={{ zIndex: 1 }} className="material-icons">
        {props.icon}
      </span>
      <S.ButtonCover color={props.color} />
    </S.ModalButton>
  );
};

interface ChannelsContainerProps {
  mixer: Mixer;
  pressedKey?: string;
}

const ChannelsContainer: React.FC<ChannelsContainerProps> = observer((props) => {
  const mixer = props.mixer;
  const channelsRef = useRef(mixer.channels);
  const channels = channelsRef.current;
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [fileLink, setFileLink] = useState("");

  useEffect(() => {
    const eventHandler = (e: MouseEvent) => {
      e.stopPropagation();
      if (!AddFileLinkModalStore.isOpen) {
        setSelectedIndex(undefined);
      }
    };
    window.addEventListener("click", eventHandler);
    return () => window.removeEventListener("click", eventHandler);
  }, []);

  useEffect(() => {
    if (props.pressedKey === "Escape") {
      EditModeStore.turnOffEditMode();
    }
  }, [props.pressedKey]);

  const handleChannelDelete = (channel: Channel) => {
    mixer.removeChannel(channel.index);
    if (!mixer.channelsLoaded) {
      EditModeStore.turnOffEditMode();
    }
  };

  const renderChannels = () => {
    return channels.map((channel, index) => {
      if (channel) {
        return (
          <S.Channel key={index}>
            <ChannelComponent channel={channel} pressedKey={props.pressedKey} onDeleteChannel={handleChannelDelete} />
          </S.Channel>
        );
      } else {
        return (
          <S.Channel key={index}>
            <EmptyChannel
              index={index}
              selectedIndex={selectedIndex}
              onClick={() => setSelectedIndex(index)}
              onFileSelect={mixer.addChannel.bind(mixer)}
            />
          </S.Channel>
        );
      }
    });
  };

  const handleDownloadProgressUpdate = (e: ProgressEvent) => {
    setDownloadProgress((e.loaded / e.total) * 100);
  };

  const handleLinkAddConfirm = async () => {
    setIsDownloading(true);
    const channelAdded = await AddFileLinkModalStore.addChannelWithLink(
      mixer,
      fileLink,
      selectedIndex,
      handleDownloadProgressUpdate
    );
    if (channelAdded) {
      setFileLink("");
    }
    setDownloadProgress(0);
    setIsDownloading(false);
  };

  const handleLinkAddCancel = () => {
    AddFileLinkModalStore.closeModal();
    setFileLink("");
    setDownloadProgress(0);
    setIsDownloading(false);
  };

  return (
    <S.ChannelsContainer>
      {AddFileLinkModalStore.isOpen ? (
        <S.ModalMask>
          <S.AddChannelWithLinkModal>
            <S.InputContainer>
              <S.LinkIcon />
              <S.AddLinkInput onChange={(e) => setFileLink(e.target.value)} value={fileLink} />
            </S.InputContainer>
            <S.DownloadProgress progress={downloadProgress} />
            <S.ButtonsContainer>
              <ModalButton
                color={THEME.MAIN_COLOR_GREEN}
                icon="done"
                onClick={() => {
                  if (!isDownloading) {
                    handleLinkAddConfirm();
                  }
                }}
              />
              <ModalButton
                color={THEME.ERROR}
                icon="close"
                onClick={() => {
                  if (!isDownloading) {
                    handleLinkAddCancel();
                  }
                }}
              />
            </S.ButtonsContainer>
          </S.AddChannelWithLinkModal>
        </S.ModalMask>
      ) : null}
      {renderChannels()}
    </S.ChannelsContainer>
  );
});

export default ChannelsContainer;
