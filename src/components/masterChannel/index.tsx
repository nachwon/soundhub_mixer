import React, { useState, useRef, useEffect } from "react";
import { MasterChannel } from "../../models/channels";
import * as S from "./styles";
import { MIXER_STYLES } from "../../constants";
import { useLayoutEffect } from "react";

interface MasterChannelVolumeMetersProps {
  channel: MasterChannel;
}

const MasterChannelVolumeMeters: React.FC<MasterChannelVolumeMetersProps> = (
  props
) => {
  const masterChannel = props.channel;
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const [leftCanvasCtx, setLeftCanvasCtx] =
    useState<CanvasRenderingContext2D>();
  const [rightCanvasCtx, setRightCanvasCtx] =
    useState<CanvasRenderingContext2D>();

  const renderMasterTicks = () => {
    const ticksArray = [];
    for (let i = 0; i < 11; i++) {
      ticksArray.push(<S.MasterTick key={i} />);
    }
    return ticksArray;
  };

  useEffect(() => {
    const drawMeter = (
      canvasCtx: CanvasRenderingContext2D | undefined,
      meterHeight: number
    ) => {
      if (!canvasCtx) {
        return;
      }
      canvasCtx.clearRect(
        0,
        0,
        MIXER_STYLES.faderWidth,
        MIXER_STYLES.faderLength
      );
      for (let i = 0; i < meterHeight; i++) {
        if (i % 3 === 0) {
          continue;
        }
        canvasCtx.fillRect(2, MIXER_STYLES.faderLength - i, 8, 1);
      }
    };

    const intervalId = setInterval(() => {
      const [dBFSL, dBFSR] = masterChannel.getCurrentLevels();
      const meterHeightL = dBFSToMeterHeight(
        -dBFSL,
        48,
        0,
        0,
        MIXER_STYLES.faderLength
      );
      const meterHeightR = dBFSToMeterHeight(
        -dBFSR,
        48,
        0,
        0,
        MIXER_STYLES.faderLength
      );
      drawMeter(leftCanvasCtx, meterHeightL);
      drawMeter(rightCanvasCtx, meterHeightR);
    }, 10);

    return () => clearInterval(intervalId);
  }, [leftCanvasCtx, masterChannel, rightCanvasCtx]);

  useLayoutEffect(() => {
    const leftCanvasCtx = initCanvas(leftCanvasRef.current);
    const rightCanvasCtx = initCanvas(rightCanvasRef.current);
    if (leftCanvasRef) {
      setLeftCanvasCtx(leftCanvasCtx);
      setRightCanvasCtx(rightCanvasCtx);
    }
  }, []);

  const dBFSToMeterHeight = (
    val: number,
    f0: number,
    f1: number,
    t0: number,
    t1: number
  ) => {
    return ((val - f0) * (t1 - t0)) / (f1 - f0) + t0;
  };

  const initCanvas = (
    canvas: HTMLCanvasElement | null
  ): CanvasRenderingContext2D | undefined => {
    if (canvas === null) {
      return;
    }

    const volumeMeterCtx = canvas.getContext("2d");
    if (volumeMeterCtx === null) {
      return;
    }
    const grd = volumeMeterCtx.createLinearGradient(5, 0, 5, 280);
    grd.addColorStop(0.3, "#4afccd");
    grd.addColorStop(0.6, "#00b0f0");
    grd.addColorStop(1, "#005ae0");

    volumeMeterCtx.fillStyle = grd;
    return volumeMeterCtx;
  };

  return (
    <S.MasterChannelMeter>
      <S.FaderRail>
        <S.ChannelVolumeMeterContainer>
          <S.ChannelVolumeMeter
            ref={leftCanvasRef}
            width={MIXER_STYLES.faderWidth}
            height={MIXER_STYLES.faderLength}
          />
        </S.ChannelVolumeMeterContainer>
        <S.MeterLabel>L</S.MeterLabel>
      </S.FaderRail>
      <S.MasterChannelMeterTicksContainer>
        <S.MasterMeterContainer>{renderMasterTicks()}</S.MasterMeterContainer>
        <S.MasterMeterCenter></S.MasterMeterCenter>
        <S.MasterMeterContainer>{renderMasterTicks()}</S.MasterMeterContainer>
      </S.MasterChannelMeterTicksContainer>
      <S.FaderRail>
        <S.ChannelVolumeMeterContainer>
          <S.ChannelVolumeMeter
            ref={rightCanvasRef}
            width={MIXER_STYLES.faderWidth}
            height={MIXER_STYLES.faderLength}
          />
        </S.ChannelVolumeMeterContainer>
        <S.MeterLabel>R</S.MeterLabel>
      </S.FaderRail>
    </S.MasterChannelMeter>
  );
};

interface MasterChannelProps {
  masterChannel: MasterChannel;
}

const MasterChannelComponent: React.FC<MasterChannelProps> = (props) => {
  const masterChannel: MasterChannel = props.masterChannel;
  const getFaderPosition = (gain: number) => {
    return (1 - gain / masterChannel.maxGain) * 100;
  };

  const [faderPosition, setFaderPosition] = useState(getFaderPosition(1));
  const faderRail = useRef<HTMLDivElement>(null);

  const renderTicks = () => {
    const ticksArray = [];
    for (let i = 0; i < 15; i++) {
      ticksArray.push(<S.FaderTick key={i} />);
    }
    return ticksArray;
  };

  const handleFaderMouseDown = (e: React.MouseEvent) => {
    window.addEventListener("mousemove", handleFaderMouseMove);
    window.addEventListener("mouseup", removeGlobalFaderEvents);
  };

  const handleFaderMouseMove = (e: MouseEvent) => {
    if (!faderRail.current) {
      return;
    }
    const rect = faderRail.current.getBoundingClientRect();
    const faderRailTop = rect.top;
    const faderPosition = Math.max(
      Math.min(e.pageY - faderRailTop, faderRail.current.offsetHeight),
      0
    );
    const faderPositionScaled =
      ((faderPosition / faderRail.current.offsetHeight) * 140) / 100;
    const faderGainValue = masterChannel.maxGain - faderPositionScaled;

    masterChannel.setGain(faderGainValue);
    setFaderPosition(getFaderPosition(faderGainValue));
  };

  const removeGlobalFaderEvents = (e: MouseEvent) => {
    window.removeEventListener("mousemove", handleFaderMouseMove);
    window.removeEventListener("mouseup", removeGlobalFaderEvents);
  };

  return (
    <S.MasterVolumeControlContainer>
      <S.MasterChannelWrapper>
        <S.MasterChannelInnerWrapper>
          <S.FaderSection>
            <S.FaderRail ref={faderRail}>
              <S.FaderTicksContainer>{renderTicks()}</S.FaderTicksContainer>
              <S.MasterFaderHandle
                onMouseDown={(e) => handleFaderMouseDown(e)}
                position={faderPosition}
              />
            </S.FaderRail>
          </S.FaderSection>
          <S.MasterTrackNameSection>
            <S.MasterTrackName>Master</S.MasterTrackName>
          </S.MasterTrackNameSection>
        </S.MasterChannelInnerWrapper>
        <MasterChannelVolumeMeters channel={masterChannel} />
      </S.MasterChannelWrapper>
    </S.MasterVolumeControlContainer>
  );
};

export default MasterChannelComponent;
