import { observer } from "mobx-react";
import { Channel } from "../../../../models/channels";
import * as S from "./styles";

interface MuteSoloComponentProps {
  channel: Channel;
}

const MuteSoloComponent: React.FC<MuteSoloComponentProps> = observer((props) => {
  const channel = props.channel;

  return (
    <S.ChannelMuteSoloSection>
      <S.MuteButton onClick={() => channel.toggleMute()} muted={channel.isMuted}>
        M
      </S.MuteButton>
      <S.SoloButton onClick={() => channel.toggleSolo()} soloed={channel.isSoloed}>
        S
      </S.SoloButton>
    </S.ChannelMuteSoloSection>
  );
});

export default MuteSoloComponent;
