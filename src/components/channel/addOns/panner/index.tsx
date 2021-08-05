import React, { useState, useRef } from "react";
import { Channel } from "../../../../models/channels";
import * as S from "./styles";

interface PannerProps {
  channel: Channel;
}

const MaxPanAngle = 125;

const Panner: React.FC<PannerProps> = (props) => {
  const channel = props.channel;
  const pannerRef = useRef<HTMLDivElement>(null);
  const [pannerDeg, setPannerDeg] = useState<number>(0);

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
    setPannerDeg(deg);
    channel.setPan(deg / MaxPanAngle);
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

  return (
    <S.PannerSection>
      <S.PannerContainer>
        <S.PannerKnobTop ref={pannerRef} onMouseDown={handlePannerMouseDown}>
          <S.PannerPointerWrapper value={pannerDeg}>
            <S.PannerPointer />
          </S.PannerPointerWrapper>
          <S.PannerKnobPlate />
          <S.PannerKnobPlateMask />
        </S.PannerKnobTop>
      </S.PannerContainer>
      <S.PannerValueDisplay>{processPannerDisplayValue(pannerDeg)}</S.PannerValueDisplay>
    </S.PannerSection>
  );
};

export default Panner;
