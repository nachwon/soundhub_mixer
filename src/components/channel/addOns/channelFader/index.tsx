import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MIXER_STYLES } from "../../../../constants";
import { Channel } from "../../../../models/channels";
import { dBFSToMeterHeight } from "../../../../utils";
import * as S from "./styles";

interface ChannelVolumeMeterCanvasProps {
  channel: Channel;
}

const ChannelVolumeMeterCanvas: React.FC<ChannelVolumeMeterCanvasProps> = (props) => {
  const channel = props.channel;
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const leftPeakRef = useRef<HTMLCanvasElement>(null);
  const rightPeakRef = useRef<HTMLCanvasElement>(null);
  const [leftCanvasCtx, setLeftCanvasCtx] = useState<CanvasRenderingContext2D>();
  const [rightCanvasCtx, setRightCanvasCtx] = useState<CanvasRenderingContext2D>();
  const [leftPeakCanvasCtx, setLeftPeakCanvasCtx] = useState<CanvasRenderingContext2D>();
  const [rightPeakCanvasCtx, setRightPeakCanvasCtx] = useState<CanvasRenderingContext2D>();

  useEffect(() => {
    const drawMeter = (canvasCtx: CanvasRenderingContext2D | undefined, meterHeight: number) => {
      if (!canvasCtx) {
        return;
      }
      canvasCtx.clearRect(0, 0, MIXER_STYLES.faderWidth, MIXER_STYLES.faderLength);
      for (let i = 0; i < meterHeight; i++) {
        if (i % 3 === 0) {
          continue;
        }
        canvasCtx.fillRect(2, MIXER_STYLES.faderLength - i, 8, 1);
      }
    };

    const drawPeak = (canvasCtx: CanvasRenderingContext2D | undefined, peakHeight: number, counter: number) => {
      if (!canvasCtx) {
        return;
      }
      canvasCtx.clearRect(0, 0, MIXER_STYLES.faderWidth, MIXER_STYLES.faderLength);
      canvasCtx.globalAlpha = counter < 70 ? 1 : (100 - counter) / 70;
      canvasCtx.fillRect(1, MIXER_STYLES.faderLength - peakHeight, 8, 1);
    };

    const [dBFSL, dBFSR] = channel.getCurrentLevels();
    const [peakL, peakR] = channel.getPeaks();
    const [counterL, counterR] = channel.getCounters();
    drawMeter(leftCanvasCtx, dBFSToMeterHeight(dBFSL));
    drawMeter(rightCanvasCtx, dBFSToMeterHeight(dBFSR));
    drawPeak(leftPeakCanvasCtx, dBFSToMeterHeight(peakL), counterL);
    drawPeak(rightPeakCanvasCtx, dBFSToMeterHeight(peakR), counterR);
  }, [leftCanvasCtx, leftPeakCanvasCtx, channel, rightCanvasCtx, rightPeakCanvasCtx, channel.audioCtx.currentTime]);

  useLayoutEffect(() => {
    const leftMeterCtx = initMeterCanvas(leftCanvasRef.current);
    const rightCanvasCtx = initMeterCanvas(rightCanvasRef.current);
    const leftPeakCtx = initPeakCanvas(leftPeakRef.current);
    const rightPeakCtx = initPeakCanvas(rightPeakRef.current);
    setLeftCanvasCtx(leftMeterCtx);
    setRightCanvasCtx(rightCanvasCtx);
    setLeftPeakCanvasCtx(leftPeakCtx);
    setRightPeakCanvasCtx(rightPeakCtx);
  }, []);

  const initMeterCanvas = (canvas: HTMLCanvasElement | null): CanvasRenderingContext2D | undefined => {
    if (canvas === null) {
      return;
    }

    const canvasCtx = canvas.getContext("2d");
    if (canvasCtx === null) {
      return;
    }
    const grd = canvasCtx.createLinearGradient(5, 0, 5, 280);
    grd.addColorStop(0.3, "#4afccd");
    grd.addColorStop(0.6, "#00b0f0");
    grd.addColorStop(1, "#005ae0");

    canvasCtx.fillStyle = grd;
    return canvasCtx;
  };

  const initPeakCanvas = (canvas: HTMLCanvasElement | null): CanvasRenderingContext2D | undefined => {
    if (canvas === null) {
      return;
    }

    const canvasCtx = canvas.getContext("2d");
    if (canvasCtx === null) {
      return;
    }

    canvasCtx.fillStyle = "red";
    return canvasCtx;
  };

  return (
    <S.ChannelVolumeMeterContainer>
      <S.ChannelVolumeMeterLeft ref={leftCanvasRef} width={MIXER_STYLES.faderWidth} height={MIXER_STYLES.faderLength} />
      <S.ChannelVolumeMeterLeft ref={leftPeakRef} width={MIXER_STYLES.faderWidth} height={MIXER_STYLES.faderLength} />
      <S.ChannelVolumeMeterRight
        ref={rightCanvasRef}
        width={MIXER_STYLES.faderWidth}
        height={MIXER_STYLES.faderLength}
      />
      <S.ChannelVolumeMeterRight ref={rightPeakRef} width={MIXER_STYLES.faderWidth} height={MIXER_STYLES.faderLength} />
    </S.ChannelVolumeMeterContainer>
  );
};

interface ChannelFaderProps {
  channel: Channel;
}

const ChannelFader: React.FC<ChannelFaderProps> = (props) => {
  const channel = props.channel;

  const renderTicks = () => {
    const ticksArray = [];
    for (let i = 0; i < 15; i++) {
      ticksArray.push(<S.FaderTick key={i} />);
    }
    return ticksArray;
  };

  return (
    <S.FaderSection>
      <S.FaderRail>
        <S.FaderTicksContainer>{renderTicks()}</S.FaderTicksContainer>
        <S.FaderHandle onMouseDown={() => {}} position={0} />
        <ChannelVolumeMeterCanvas channel={channel} />
      </S.FaderRail>
    </S.FaderSection>
  );
};

export default ChannelFader;
