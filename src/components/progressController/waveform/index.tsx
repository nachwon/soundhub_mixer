import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { THEME } from "../../../constants";
import * as S from "./styles";

interface WaveformProps {
  width: number;
  height: number;
  data: Array<number>;
}

const Waveform: React.FC<WaveformProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D>();
  const frame = useRef(0);

  const initCanvas = (canvas: HTMLCanvasElement | null): CanvasRenderingContext2D | undefined => {
    if (canvas === null) {
      return;
    }

    const canvasCtx = canvas.getContext("2d");
    if (canvasCtx === null) {
      return;
    }

    canvasCtx.fillStyle = THEME.MAIN_COLOR_BLUE;
    canvasCtx.imageSmoothingEnabled = true;
    return canvasCtx;
  };

  useLayoutEffect(() => {
    const meterCtx = initCanvas(canvasRef.current);

    setCanvasCtx(meterCtx);
  }, []);

  useEffect(() => {
    if (!canvasCtx) {
      return;
    }

    const drawWaveform = (frame: number) => {
      if (frame === 40) {
        return;
      }

      canvasCtx.clearRect(0, 0, props.width, props.height);
      props.data.forEach((value, index) => {
        canvasCtx.fillStyle = "#888888";
        canvasCtx.fillRect(
          index * 2,
          Math.max((props.height - value) / 2, (props.height - frame * 2) / 2),
          1,
          Math.min(frame, value / 2)
        );

        canvasCtx.fillStyle = "#666666";
        canvasCtx.fillRect(index * 2, props.height / 2, 1, Math.min(frame, value / 2));
      });
      requestAnimationFrame(() => drawWaveform(frame + 1));
    };

    requestAnimationFrame(() => drawWaveform(frame.current));
  }, [canvasCtx, props.height, props.width, props.data]);

  return <S.WaveformCanvas ref={canvasRef} width={props.width} height={props.height} />;
};

export default Waveform;
