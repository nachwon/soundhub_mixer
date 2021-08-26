import { observer } from "mobx-react";
import { Channel } from "../../../../models/channels";
import { useWaveformWorker } from "../../../progressController/waveform/hooks";
import * as S from "./styles";

interface MuteSoloComponentProps {
  channel: Channel;
}

const MuteSoloComponent: React.FC<MuteSoloComponentProps> = observer((props) => {
  const channel = props.channel;
  const { applyGain, updateChannelGains } = useWaveformWorker();

  const handleMute = async () => {
    channel.toggleMute();
    await applyGain(channel.index, channel.actualGain);
  };

  const handleSolo = async () => {
    channel.toggleSolo();
    await updateChannelGains();
  };

  return (
    <S.ChannelMuteSoloSection>
      <S.MuteButton onClick={handleMute} muted={channel.isMuted}>
        M
      </S.MuteButton>
      <S.SoloButton onClick={handleSolo} soloed={channel.isSoloed}>
        S
      </S.SoloButton>
    </S.ChannelMuteSoloSection>
  );
});

export default MuteSoloComponent;
