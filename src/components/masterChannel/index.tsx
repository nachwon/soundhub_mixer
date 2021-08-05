import React, { useState, useRef, useEffect } from "react";
import { MasterChannel } from "../../models/channels";
import * as S from "./styles";
import { MIXER_STYLES } from "../../constants";
import { useLayoutEffect } from "react";
import { dBFSToMeterHeight } from "../../utils";

interface MasterChannelVolumeMetersProps {
  channel: MasterChannel;
}

const MasterChannelVolumeMeters: React.FC<MasterChannelVolumeMetersProps> = (props) => {
  const masterChannel = props.channel;
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const leftPeakRef = useRef<HTMLCanvasElement>(null);
  const rightPeakRef = useRef<HTMLCanvasElement>(null);
  const [leftCanvasCtx, setLeftCanvasCtx] = useState<CanvasRenderingContext2D>();
  const [rightCanvasCtx, setRightCanvasCtx] = useState<CanvasRenderingContext2D>();
  const [leftPeakCanvasCtx, setLeftPeakCanvasCtx] = useState<CanvasRenderingContext2D>();
  const [rightPeakCanvasCtx, setRightPeakCanvasCtx] = useState<CanvasRenderingContext2D>();

  const renderMasterTicks = () => {
    const ticksArray = [];
    for (let i = 0; i < 11; i++) {
      ticksArray.push(<S.MasterTick key={i} />);
    }
    return ticksArray;
  };

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
      canvasCtx.fillRect(1, MIXER_STYLES.faderLength - peakHeight, 8, 2);
    };

    const intervalId = setInterval(() => {
      const [dBFSL, dBFSR] = masterChannel.getCurrentLevels();
      const [peakL, peakR] = masterChannel.getPeaks();
      const [counterL, counterR] = masterChannel.getCounters();
      drawMeter(leftCanvasCtx, dBFSToMeterHeight(dBFSL));
      drawMeter(rightCanvasCtx, dBFSToMeterHeight(dBFSR));
      drawPeak(leftPeakCanvasCtx, dBFSToMeterHeight(peakL), counterL);
      drawPeak(rightPeakCanvasCtx, dBFSToMeterHeight(peakR), counterR);
    }, 10);

    return () => clearInterval(intervalId);
  }, [leftCanvasCtx, leftPeakCanvasCtx, masterChannel, rightCanvasCtx, rightPeakCanvasCtx]);

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
    <S.MasterChannelMeter>
      <S.MeterRail>
        <S.ChannelVolumeMeterContainer>
          <S.ChannelVolumeMeter ref={leftCanvasRef} width={MIXER_STYLES.faderWidth} height={MIXER_STYLES.faderLength} />
          <S.ChannelVolumeMeter ref={leftPeakRef} width={MIXER_STYLES.faderWidth} height={MIXER_STYLES.faderLength} />
        </S.ChannelVolumeMeterContainer>
        <S.MeterLabel>L</S.MeterLabel>
      </S.MeterRail>
      <S.MasterChannelMeterTicksContainer>
        <S.MasterMeterContainer>{renderMasterTicks()}</S.MasterMeterContainer>
        <S.MasterMeterCenter></S.MasterMeterCenter>
        <S.MasterMeterContainer>{renderMasterTicks()}</S.MasterMeterContainer>
      </S.MasterChannelMeterTicksContainer>
      <S.MeterRail>
        <S.ChannelVolumeMeterContainer>
          <S.ChannelVolumeMeter
            ref={rightCanvasRef}
            width={MIXER_STYLES.faderWidth}
            height={MIXER_STYLES.faderLength}
          />
          <S.ChannelVolumeMeter ref={rightPeakRef} width={MIXER_STYLES.faderWidth} height={MIXER_STYLES.faderLength} />
        </S.ChannelVolumeMeterContainer>
        <S.MeterLabel>R</S.MeterLabel>
      </S.MeterRail>
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
    const faderPosition = Math.max(Math.min(e.pageY - faderRailTop, faderRail.current.offsetHeight), 0);
    const faderPositionScaled = ((faderPosition / faderRail.current.offsetHeight) * 140) / 100;
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
              <S.MasterFaderHandle onMouseDown={(e) => handleFaderMouseDown(e)} position={faderPosition} />
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
