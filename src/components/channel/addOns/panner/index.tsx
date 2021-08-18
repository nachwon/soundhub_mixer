import { observer } from "mobx-react";
import React, { useState, useRef } from "react";
import { useEffect } from "react";
import { Channel } from "../../../../models/channels";
import * as S from "./styles";

interface PannerProps {
  channel: Channel;
  pressedKey?: string;
}

const MaxPanAngle = 135;
const UnitPannerValue = 5;

const unitDegCalculator = (deg: number) => {
  const unitAngle = (MaxPanAngle / 100) * UnitPannerValue;
  return Math.round(deg / unitAngle) * unitAngle;
};

const doubleUnitDegCalculator = (deg: number) => {
  const unitAngle = (MaxPanAngle / 100) * UnitPannerValue * 4;
  return Math.round(deg / unitAngle) * unitAngle;
};

const fineTuningCalculator = (deg: number) => {
  return deg;
};

const PannerDegCalculatorMap: { [k: string]: (deg: number) => number } = {
  default: unitDegCalculator,
  ShiftLeft: fineTuningCalculator,
  MetaLeft: doubleUnitDegCalculator,
};

const Panner: React.FC<PannerProps> = observer(({ channel, pressedKey = "default" }) => {
  const pannerRef = useRef<HTMLDivElement>(null);
  const [pannerDeg, setPannerDeg] = useState<number>(0);
  const pannerDegCalculator = useRef<(deg: number) => number>(unitDegCalculator);

  useEffect(() => {
    setPannerDeg(channel.pannerDeg);
  }, [channel.pannerDeg]);

  useEffect(() => {
    const calcFunc = PannerDegCalculatorMap[pressedKey];
    if (!calcFunc) {
      pannerDegCalculator.current = unitDegCalculator;
    } else {
      pannerDegCalculator.current = calcFunc;
    }
  }, [pressedKey]);

  const getPannerCenter = () => {
    if (!pannerRef.current) {
      return [];
    }

    const rect = pannerRef.current.getBoundingClientRect();
    const pannerCenterX = rect.left + rect.width / 2;
    const pannerCenterY = rect.top + rect.height / 2;
    return [pannerCenterX, pannerCenterY];
  };

  const removeGlobalPannerEvents = () => {
    window.removeEventListener("mousemove", handlePannerMouseMove);
    window.removeEventListener("mouseup", removeGlobalPannerEvents);
  };

  const handlePannerMouseDown = (e: React.MouseEvent) => {
    window.addEventListener("mousemove", handlePannerMouseMove);
    window.addEventListener("mouseup", removeGlobalPannerEvents);
  };

  const handlePannerMouseMove = (e: MouseEvent) => {
    const [pannerCenterX, pannerCenterY] = getPannerCenter();
    const lenX = e.clientX - pannerCenterX;
    const lenY = pannerCenterY - e.clientY;
    const deg = Math.max(Math.min(Math.round(Math.atan2(lenX, lenY) * (180 / Math.PI)), MaxPanAngle), -MaxPanAngle);
    const calculatedDeg = pannerDegCalculator.current(deg);

    channel.setPan(calculatedDeg / MaxPanAngle);
    channel.setPannerDeg(calculatedDeg);
  };

  const processPannerDisplayValue = (boundedDeg: number) => {
    const displayValue = Math.round((boundedDeg / MaxPanAngle) * 100);
    if (displayValue === 0) {
      return "C";
    } else if (displayValue > 0) {
      return `R ${displayValue}`;
    } else {
      return `L ${Math.abs(displayValue)}`;
    }
  };

  const renderTicks = () => {
    const ticks = [];
    const range = [...Array(6).keys()];
    for (let i of range) {
      i === range.length
        ? ticks.push(<S.PannerRangeTick key={"R6"} deg={MaxPanAngle} />)
        : ticks.push(
            <>
              <S.PannerRangeTick key={`R${i}`} deg={(i * MaxPanAngle) / 5} />
              <S.PannerRangeTick key={`L${i}`} deg={MaxPanAngle + 90 + (i * MaxPanAngle) / 5} />
            </>
          );
    }
    return ticks;
  };

  return (
    <S.PannerSection>
      <S.PannerContainer>
        <S.PannerRangeIndicator>
          <S.PannerRangeMask />
          <S.PannerRangeBottomMask />
          <S.PannerRangeOuterBorder />
          {renderTicks()}
        </S.PannerRangeIndicator>
        <S.Panner>
          <S.PannerKnobTop ref={pannerRef} onMouseDown={handlePannerMouseDown}>
            <S.PannerPointerWrapper value={pannerDeg}>
              <S.PannerPointer />
            </S.PannerPointerWrapper>
            <S.PannerKnobPlate />
            <S.PannerKnobPlateMask />
          </S.PannerKnobTop>
        </S.Panner>
      </S.PannerContainer>
      <S.PannerValueDisplay>{processPannerDisplayValue(pannerDeg)}</S.PannerValueDisplay>
    </S.PannerSection>
  );
});

export default Panner;
