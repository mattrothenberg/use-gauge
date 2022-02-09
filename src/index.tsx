import { useCallback, useMemo, useRef } from 'react';
import { degreesToRadians, makeTickMarks, polarToCartesian } from './lib';

interface UseGaugeParams {
  size: number;
  padding: number;
  startAngle: number;
  endAngle: number;
  numTicks: number;
  domain: [number, number];
}

interface GetNeedleParams {
  value: number;
  baseRadius: number;
  tipRadius: number;
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

interface RedrawSVGParams {
  padding: number;
}

function redrawSvg(node: SVGSVGElement, params: RedrawSVGParams) {
  const { padding } = params;
  const bbox = node.getBBox();
  const width = bbox.width;
  const height = bbox.height;

  node.setAttribute('width', String(width));
  node.setAttribute('height', String(height));
  node.setAttribute(
    'viewBox',
    `${bbox.x - padding / 2} ${bbox.y - padding / 2} ${width + padding} ${
      height + padding
    }`
  );
}

function useSVGRef(params: UseGaugeParams) {
  const { padding, size, startAngle, endAngle, numTicks } = params;
  const ref = useRef<SVGSVGElement>(null!);

  const setRef = useCallback(
    (node: any) => {
      if (ref.current) {
      }

      if (node) {
        redrawSvg(node, {
          padding,
        });
      }

      ref.current = node;
    },
    [padding, size, startAngle, endAngle, numTicks]
  );

  return {
    setRef,
    svg: ref,
  };
}

export function useGauge(params: UseGaugeParams) {
  const { startAngle, endAngle, numTicks, size, domain, padding } = params;
  const radius = size;
  const [minValue, maxValue] = domain;
  const { setRef: ref, svg } = useSVGRef(params);

  const ticks = useMemo(() => {
    return makeTickMarks(startAngle, endAngle, numTicks).reverse();
  }, [startAngle, endAngle, numTicks]);

  const getLabelProps = useCallback(
    (params: GetLabelPropsParams) => {
      if (svg.current) {
        redrawSvg(svg.current, { padding });
      }
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
      if (svg.current) {
        redrawSvg(svg.current, { padding });
      }
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

  const angleToValue = (angle: number) => {
    const angleRange = endAngle - startAngle;
    const valueRange = maxValue - minValue;
    const value = minValue + ((angle - startAngle) / angleRange) * valueRange;
    return Math.round(value);
  };

  const valueToAngle = (value: number) => {
    const angleRange = endAngle - startAngle;
    const valueRange = maxValue - minValue;
    const angle = startAngle + ((value - minValue) / valueRange) * angleRange;
    return Math.round(angle);
  };

  const getArcProps = useCallback(
    (params: GetArcPropsParams) => {
      if (svg.current) {
        redrawSvg(svg.current, { padding });
      }

      const { offset = 0, startAngle, endAngle } = params;
      let start = polarToCartesian(
        size / 2,
        size / 2,
        radius + offset,
        endAngle
      );
      let end = polarToCartesian(
        size / 2,
        size / 2,
        radius + offset,
        startAngle
      );
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
    },
    [size, radius]
  );

  const getNeedleProps = useCallback(
    (params: GetNeedleParams) => {
      if (svg.current) {
        redrawSvg(svg.current, { padding });
      }
      const { value, baseRadius, tipRadius } = params;
      const angle = valueToAngle(value);

      const baseCircleCenter = {
        x: size / 2,
        y: size / 2,
      };

      const tipCircleCenter = polarToCartesian(
        size / 2,
        size / 2,
        radius,
        angle
      );

      return {
        base: {
          r: baseRadius,
          cx: baseCircleCenter.x,
          cy: baseCircleCenter.y,
        },
        tip: {
          r: tipRadius,
          cx: tipCircleCenter.x,
          cy: tipCircleCenter.y,
        },
        points: [
          [
            baseCircleCenter.x +
              baseRadius * Math.cos(degreesToRadians(angle + 90)),
            baseCircleCenter.y +
              baseRadius * Math.sin(degreesToRadians(angle + 90)),
          ],
          [
            tipCircleCenter.x +
              tipRadius * Math.cos(degreesToRadians(angle + 90)),
            tipCircleCenter.y +
              tipRadius * Math.sin(degreesToRadians(angle + 90)),
          ],
          [
            tipCircleCenter.x +
              tipRadius * Math.cos(degreesToRadians(angle - 90)),
            tipCircleCenter.y +
              tipRadius * Math.sin(degreesToRadians(angle - 90)),
          ],
          [
            baseCircleCenter.x +
              baseRadius * Math.cos(degreesToRadians(angle - 90)),
            baseCircleCenter.y +
              baseRadius * Math.sin(degreesToRadians(angle - 90)),
          ],
        ]
          .map(([x, y]) => `${x},${y}`)
          .join(' '),
      };
    },
    [valueToAngle, size, radius]
  );

  return {
    ticks,
    getTickProps,
    getLabelProps,
    valueToAngle,
    angleToValue,
    getArcProps,
    getNeedleProps,
    ref,
  };
}
