export const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
export const degreesToRadians = (degrees: number) => {
  return (degrees * Math.PI) / 180;
};

export const makeTickMarks = (
  minAngle: number,
  maxAngle: number,
  numTicks: number
) => {
  const tickMarks = [];
  const angleRange = maxAngle - minAngle;
  const angleStep = angleRange / (numTicks - 1);
  for (let i = 0; i < numTicks; i++) {
    tickMarks.push(Math.floor(minAngle + i * angleStep));
  }
  return tickMarks.reverse();
};

export const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) => {
  const angleInRadians = degreesToRadians(angleInDegrees);

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};
