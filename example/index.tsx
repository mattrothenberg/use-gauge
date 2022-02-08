import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useGauge } from '../.';

const size = 200;
const min = 20;
const max = 120;

const App = () => {
  const [value, setValue] = React.useState(0);

  const { ref, ticks, getTickProps, getLabelProps, getTickValue, getArcProps } =
    useGauge({
      startAngle: 150,
      endAngle: 390,
      numTicks: 11,
      size,
      padding: 24,
      domain: [min, max],
    });

  return (
    <div className="p-4">
      <svg ref={ref} className="border border-black max-w-full">
        <path
          {...getArcProps({ offset: 8, startAngle: 150, endAngle: 390 })}
          fill="none"
          className="stroke-gray-100"
          strokeWidth={16}
        />
        <path
          {...getArcProps({ offset: 8, startAngle: 150, endAngle: 180 })}
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
                  {getTickValue(angle)}
                </text>
              </React.Fragment>
            );
          })}
        </g>
      </svg>
      <div className="mt-4">
        <p>Value: {value}</p>
        <input
          className="w-full"
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
