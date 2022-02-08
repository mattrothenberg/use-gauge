import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useGauge } from '../.';

const size = 300;
const min = 20;
const max = 100;

const App = () => {
  const [value, setValue] = React.useState(0);

  const { ticks, getTickProps, getLabelProps, getTickValue } = useGauge({
    startAngle: 150,
    endAngle: 390,
    numTicks: 9,
    size,
    padding: 24,
  });

  return (
    <div className="p-4">
      <svg height={250} width={size} className="border border-black">
        <g id="ticks">
          {ticks.map((angle) => {
            return (
              <React.Fragment key={`tick-group-${angle}`}>
                <line
                  className="stroke-gray-500"
                  {...getTickProps({ angle, length: 10 })}
                />
                <text
                  className="text-xs fill-gray-500 font-medium"
                  {...getLabelProps({ angle, offset: 20 })}
                >
                  {getTickValue(angle, min, max)}
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
