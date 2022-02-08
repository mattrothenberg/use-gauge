import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useGauge } from '../.';

const width = 500;
const height = 500;
const min = 20;
const max = 80;

const App = () => {
  const [value, setValue] = React.useState(0);

  const { ticks, getTickProps, getLabelProps } = useGauge({
    startAngle: 180,
    endAngle: 360,
    numTicks: 11,
    radius: 150,
    width,
  });

  return (
    <div className="p-4">
      <div style={{ maxWidth: width, maxHeight: height }}>
        <svg className="border border-black" viewBox={`0 0 ${width} ${height}`}>
          <g id="ticks">
            {ticks.map((angle) => {
              return (
                <>
                  <line
                    className="stroke-gray-500"
                    {...getTickProps({ angle, length: 10 })}
                  />
                  <text
                    className="text-xs fill-gray-500 font-medium"
                    {...getLabelProps({ angle, offset: 20 })}
                  >
                    {angle}
                  </text>
                </>
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
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
