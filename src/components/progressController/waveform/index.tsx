import { toJS } from "mobx";
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
  const waveform = useRef<Array<number>>([]);
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
        waveform.current = toJS(props.data);
        return;
      }

      canvasCtx.clearRect(0, 0, props.width, props.height);
      props.data.forEach((value, index) => {
        const currentValue = waveform.current.length === 0 ? 0 : waveform.current[index];
        const isDecrease = currentValue > value;
        const nextFrame = isDecrease ? frame : -frame;
        const upperYMathFunc = isDecrease ? Math.min : Math.max;
        const hMathFunc = isDecrease ? Math.max : Math.min;

        const X = index * 2;
        const W = 1;
        const upperY = upperYMathFunc((props.height - value) / 2, (props.height - currentValue) / 2 + nextFrame);
        const H = hMathFunc(currentValue / 2 - nextFrame, value / 2);

        canvasCtx.fillStyle = "#888888";
        canvasCtx.fillRect(X, upperY, W, H);

        const lowerY = props.height / 2;

        canvasCtx.fillStyle = "#666666";
        canvasCtx.fillRect(X, lowerY, W, H);
      });
      requestAnimationFrame(() => drawWaveform(frame + 1));
    };

    requestAnimationFrame(() => drawWaveform(frame.current));
  }, [canvasCtx, props.height, props.width, props.data]);

  return <S.WaveformCanvas ref={canvasRef} width={props.width} height={props.height} />;
};

export default Waveform;
