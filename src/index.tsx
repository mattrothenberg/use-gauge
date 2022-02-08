import { useCallback, useMemo, useRef } from 'react';
import { scaleLinear } from '@visx/scale';
import { makeTickMarks, polarToCartesian } from './lib';

interface UseGaugeParams {
  // value: number;
  size: number;
  padding: number;
  startAngle: number;
  endAngle: number;
  numTicks: number;
  domain: [number, number];
}

interface GetTickPropsParams {
  length: number;
  angle: number;
}

interface GetLabelPropsParams {
  angle: number;
  offset: number;
}

interface GetArcPropsParams {
  offset?: number;
  startAngle: number;
  endAngle: number;
}

function useSVGRef(params: Pick<UseGaugeParams, 'padding'>) {
  const { padding } = params;
  const ref = useRef(null);

  const setRef = useCallback((node: any) => {
    if (ref.current) {
    }

    if (node) {
      var bbox = node.getBBox();
      if (!bbox) {
        throw new Error('Could not get bounding box of SVG.');
      }
      const width = bbox.width;
      const height = bbox.height;
      node.setAttribute('width', width);
      node.setAttribute('height', height);
      node.setAttribute(
        'viewBox',
        `${bbox.x - padding / 2} ${bbox.y - padding / 2} ${width + padding} ${
          height + padding
        }`
      );
    }

    ref.current = node;
  }, []);

  return setRef;
}

export function useGauge(params: UseGaugeParams) {
  const { startAngle, endAngle, numTicks, size, padding, domain } = params;
  const radius = size;
  const [minValue, maxValue] = domain;
  const ref = useSVGRef({ padding });

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

  const scale = useMemo(
    () =>
      scaleLinear({
        domain: [ticks[0], ticks[ticks.length - 1]],
        range: [minValue, maxValue],
        round: true,
      }),
    [ticks, minValue, maxValue]
  );

  function getArcProps(params: GetArcPropsParams) {
    const { offset = 0, startAngle, endAngle } = params;
    let start = polarToCartesian(size / 2, size / 2, radius + offset, endAngle);
    let end = polarToCartesian(size / 2, size / 2, radius + offset, startAngle);
    let largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    let d = [
      'M',
      start.x,
      start.y,
      'A',
      radius + offset,
      radius + offset,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(' ');
    return {
      d,
    };
  }

  return {
    ticks,
    getTickProps,
    getLabelProps,
    getTickValue: scale,
    getArcProps,
    ref,
  };
}
