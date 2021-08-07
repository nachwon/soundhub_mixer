import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MIXER_SETTINGS } from "../../constants";
import { dBFSToMeterHeight } from "../../utils";
import * as S from "./styles";

interface VolumeMeterCanvasProps {
  meterWidth: number;
  dBFS: number;
  peak: number;
  counter: number;
  position?: "L" | "R";
}

const VolumeMeterCanvas: React.FC<VolumeMeterCanvasProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const peakRef = useRef<HTMLCanvasElement>(null);
  const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D>();
  const [peakCanvasCtx, setPeakCanvasCtx] = useState<CanvasRenderingContext2D>();

  useEffect(() => {
    const drawMeter = (canvasCtx: CanvasRenderingContext2D | undefined, meterHeight: number) => {
      if (!canvasCtx) {
        return;
      }
      canvasCtx.clearRect(0, 0, MIXER_SETTINGS.faderWidth, MIXER_SETTINGS.faderLength);
      for (let i = 0; i < meterHeight; i++) {
        if (i % 3 === 0) {
          continue;
        }
        canvasCtx.fillRect(2, MIXER_SETTINGS.faderLength - i, 8, 1);
      }
    };

    const drawPeak = (canvasCtx: CanvasRenderingContext2D | undefined, peakHeight: number, counter: number) => {
      if (!canvasCtx) {
        return;
      }
      canvasCtx.clearRect(0, 0, MIXER_SETTINGS.faderWidth, MIXER_SETTINGS.faderLength);
      canvasCtx.globalAlpha = counter < 70 ? 1 : (100 - counter) / 70;
      canvasCtx.fillRect(1, MIXER_SETTINGS.faderLength - peakHeight, 8, 1);
    };

    drawMeter(canvasCtx, dBFSToMeterHeight(props.dBFS));
    drawPeak(peakCanvasCtx, dBFSToMeterHeight(props.peak), props.counter);
  }, [canvasCtx, peakCanvasCtx, props]);

  useLayoutEffect(() => {
    const meterCtx = initMeterCanvas(canvasRef.current);
    const peakCtx = initPeakCanvas(peakRef.current);

    setCanvasCtx(meterCtx);
    setPeakCanvasCtx(peakCtx);
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
    <>
      <S.ChannelVolumeMeter
        position={props.position}
        meterWidth={props.meterWidth}
        ref={canvasRef}
        width={props.meterWidth}
        height={MIXER_SETTINGS.faderLength}
      />
      <S.ChannelVolumeMeter
        position={props.position}
        meterWidth={props.meterWidth}
        ref={peakRef}
        width={props.meterWidth}
        height={MIXER_SETTINGS.faderLength}
      />
    </>
  );
};

export default VolumeMeterCanvas;
