import { useCallback } from 'react';
import { map, makeTickMarks, polarToCartesian } from './lib';

interface UseGaugeParams {
  // value: number;
  size: number;
  padding: number;
  startAngle: number;
  endAngle: number;
  numTicks: number;
}

interface GetTickPropsParams {
  length: number;
  angle: number;
}

interface GetLabelPropsParams {
  angle: number;
  offset: number;
}

export function useGauge(params: UseGaugeParams) {
  const { startAngle, endAngle, numTicks, size, padding } = params;
  const radius = size / 2 - padding;

  const tickMarkAngles = makeTickMarks(startAngle, endAngle, numTicks);
  const ticks = tickMarkAngles.reverse();

  const getLabelProps = useCallback(
    (params: GetLabelPropsParams) => {
      const { angle, offset } = params;
      const p1 = polarToCartesian(size / 2, size / 2, radius - offset, angle);

      return {
        x: p1.x,
        y: p1.y,
        dominantBaseline: 'middle',
        textAnchor: 'middle',
      };
    },
    [size, radius]
  );

  const getTickProps = useCallback(
    (params: GetTickPropsParams) => {
      const { length, angle } = params;
      const p1 = polarToCartesian(size / 2, size / 2, radius, angle);
      const p2 = polarToCartesian(size / 2, size / 2, radius + length, angle);

      return {
        key: `tick-${angle}`,
        x1: p1.x,
        x2: p2.x,
        y1: p1.y,
        y2: p2.y,
      };
    },
    [ticks, size, radius]
  );

  // Given an array of indices and a domain of values, create a scale function that returns the closest value for the provided angle
  const getTickValue = useCallback(
    (angle: number, minValue, maxValue) => {
      return map(angle, ticks[0], ticks[ticks.length - 1], minValue, maxValue);
    },
    [ticks]
  );

  return {
    ticks,
    getTickProps,
    getLabelProps,
    getTickValue,
  };
}
