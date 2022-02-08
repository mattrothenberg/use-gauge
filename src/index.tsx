import { useCallback } from 'react';
import { makeTickMarks, polarToCartesian } from './lib';

interface UseGaugeParams {
  // value: number;
  width: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  numTicks: number;
}

interface GetTickPropsParams {
  length: number;
  angle: number;
}

export function useGauge(params: UseGaugeParams) {
  const { startAngle, endAngle, numTicks, width, radius } = params;

  const tickMarkAngles = makeTickMarks(startAngle, endAngle, numTicks);
  const ticks = tickMarkAngles.reverse();

  const getTickProps = useCallback(
    (params: GetTickPropsParams) => {
      const { length, angle } = params;
      const p1 = polarToCartesian(width / 2, width / 2, radius, angle);
      const p2 = polarToCartesian(width / 2, width / 2, radius + length, angle);

      return {
        key: `tick-${angle}`,
        x1: p1.x,
        x2: p2.x,
        y1: p1.y,
        y2: p2.y,
      };
    },
    [ticks]
  );

  return {
    ticks,
    getTickProps,
  };
}
