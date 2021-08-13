import { ChangeEvent, useEffect, useState } from "react";
import { FileInputId } from "../../constants";
import { AddFileLinkModalStore } from "../../stores";
import { ChannelDto } from "../../types";
import * as S from "./styles";

interface EmptyChannelProps {
  index: number;
  selectedIndex?: number;
  onClick: Function;
  onFileSelect: (index: number, dto: ChannelDto) => void;
}

const EmptyChannel: React.FC<EmptyChannelProps> = (props) => {
  const linkModelStore = AddFileLinkModalStore;
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
    <S.EmptyChannel
      onClick={(e) => {
        e.stopPropagation();
        setShowingIndex(props.index);
      }}
    >
      <input type="file" accept=".mp3,.wav" id={fileInputId} onChange={handleFileSelect} />
      {show ? (
        <S.AddChannelButtonsContainer
          onClick={(e) => {
            e.stopPropagation();
            setShowingIndex(undefined);
          }}
        >
          <S.AddFileButton htmlFor={fileInputId} />
          <S.ButtonsDivider />
          <S.LinkFileButton onClick={() => linkModelStore.openModal()} />
        </S.AddChannelButtonsContainer>
      ) : null}
      <S.EmptyChannelInner>
        <S.EmptyChannelTextContainer>
          <S.EmptyChannelText>CHANNEL</S.EmptyChannelText>
          <S.EmptyChannelNumberText>{props.index + 1}</S.EmptyChannelNumberText>
        </S.EmptyChannelTextContainer>
      </S.EmptyChannelInner>
    </S.EmptyChannel>
  );
};

export default EmptyChannel;
