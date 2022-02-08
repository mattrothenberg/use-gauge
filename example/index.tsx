import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useGauge } from '../.';
import { useControls } from 'leva';

const App = () => {
  const {
    value,
    size,
    minValue,
    maxValue,
    startAngle,
    endAngle,
    numTicks,
    padding,
  } = useControls({
    size: { value: 200 },
    value: { value: 0, min: 0, max: 100 },
    minValue: { value: 0 },
    maxValue: { value: 100 },
    startAngle: { value: 150, min: 0, max: 360, step: 1 },
    endAngle: { value: 390, min: 0, max: 720, step: 1 },
    numTicks: { value: 11, min: 0, max: 30, step: 1 },
    padding: { value: 24, min: 0, max: 100, step: 1 },
  });

  const { ref, ticks, getTickProps, getLabelProps, scale, getArcProps } =
    useGauge({
      startAngle,
      endAngle,
      numTicks,
      size,
      padding,
      domain: [minValue, maxValue],
    });

  return (
    <div className="p-4">
      <svg ref={ref} className="border border-black max-w-full">
        <path
          {...getArcProps({ offset: 8, startAngle, endAngle })}
          fill="none"
          className="stroke-gray-100"
          strokeWidth={16}
        />
        <path
          {...getArcProps({
            offset: 8,
            startAngle: 150,
            endAngle: scale.invert(value),
          })}
          fill="none"
          className="stroke-blue-400"
          strokeWidth={16}
        />
        <g id="ticks">
          {ticks.map((angle) => {
            return (
              <React.Fragment key={`tick-group-${angle}`}>
                <line
                  className="stroke-gray-500 opacity-50"
                  {...getTickProps({ angle, length: 16 })}
                />
                <text
                  className="text-sm fill-gray-500 font-medium"
                  {...getLabelProps({ angle, offset: 20 })}
                >
                  {scale(angle)}
                </text>
              </React.Fragment>
            );
          })}
        </g>
      </svg>
      <div className="mt-4">
        <p>Value: {value}</p>
        <p>Angle: {Math.ceil(scale.invert(value))}</p>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
