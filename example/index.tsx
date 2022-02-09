import 'react-app-polyfill/ie11';
import './index.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useGauge } from '../.';
import { useControls } from 'leva';

const App = () => {
  const {
    value,
    diameter,
    minValue,
    maxValue,
    startAngle,
    endAngle,
    numTicks,
  } = useControls('Gauge settings', {
    diameter: { value: 300 },
    value: { value: 0, min: 0, max: 100 },
    minValue: { value: 0 },
    maxValue: { value: 100 },
    startAngle: { value: 90, min: 0, max: 360, step: 1 },
    endAngle: { value: 270, min: 0, max: 360, step: 1 },
    numTicks: { value: 11, min: 0, max: 30, step: 1 },
  });

  const {
    offset,
    strokeWidth: arcStrokeWidth,
    color: progressColor,
    strokeLineCap,
  } = useControls('Arc Props', {
    offset: {
      value: 8,
      min: 0,
      max: 100,
      step: 1,
    },
    strokeWidth: {
      value: 24,
      min: 0,
      max: 100,
    },
    color: {
      value: 'cornflowerblue',
    },
    strokeLineCap: {
      value: 'round',
      options: ['butt', 'round', 'square'],
    },
  });

  const { color: tickColor, length: tickLength } = useControls('Tick Props', {
    color: {
      value: '#ccc',
    },
    length: {
      value: 10,
      min: 0,
      max: 50,
    },
  });

  const {
    baseRadius,
    tipRadius,
    color: needleColor,
  } = useControls('Needle Props', {
    baseRadius: {
      value: 12,
      min: 0,
      max: 50,
    },
    tipRadius: {
      value: 2,
      min: 0,
      max: 50,
    },
    color: {
      value: '#374151',
    },
  });

  const {
    ticks,
    getTickProps,
    getLabelProps,
    valueToAngle,
    angleToValue,
    getArcProps,
    getNeedleProps,
    getSVGProps,
  } = useGauge({
    startAngle,
    endAngle,
    numTicks,
    diameter,
    domain: [minValue, maxValue],
  });

  const { tip, base, points } = getNeedleProps({
    value,
    baseRadius,
    tipRadius,
  });

  return (
    <div className="h-screen flex items-center justify-center">
      <svg {...getSVGProps()} className="max-w-full overflow-visible">
        <path
          {...getArcProps({
            offset,
            startAngle,
            endAngle,
          })}
          fill="none"
          className="stroke-gray-100"
          strokeWidth={arcStrokeWidth}
          // @ts-ignore
          strokeLinecap={strokeLineCap}
        />
        {value > minValue && (
          <path
            {...getArcProps({
              offset,
              startAngle,
              endAngle: valueToAngle(value),
            })}
            fill="none"
            stroke={progressColor}
            strokeWidth={arcStrokeWidth}
            // @ts-ignore
            strokeLinecap={strokeLineCap}
          />
        )}
        <g id="ticks">
          {ticks.map((angle) => {
            return (
              <React.Fragment key={`tick-group-${angle}`}>
                <line
                  stroke={tickColor}
                  {...getTickProps({ angle, length: tickLength })}
                />
                <text
                  className="text-sm fill-gray-500 font-medium"
                  {...getLabelProps({ angle, offset: 20 })}
                >
                  {angleToValue(angle)}
                </text>
              </React.Fragment>
            );
          })}
        </g>
        <g id="needle">
          <circle className="fill-gray-300" {...base} r={24} />
          <circle fill={needleColor} {...base} />
          <circle fill={needleColor} {...tip} />
          <polyline fill={needleColor} points={points} />
          <circle className="fill-white" {...base} r={4} />
        </g>
      </svg>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
