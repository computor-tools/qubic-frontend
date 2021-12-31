import React, { useEffect, useRef, useState } from 'react';

const extrema = function (data) {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  for (let i = 0; i < data.length; i++) {
    min = Math.min(min, data[i]);
    max = Math.max(max, data[i]);
  }

  return { min, max };
};

const catmullRom = function (points) {
  const bezierPoints = [];

  for (var i = 0; i < points.length - 1; i++) {
    const p = [
      {
        x: points[Math.max(i - 1, 0)].x,
        y: points[Math.max(i - 1, 0)].y,
      },
      {
        x: points[i].x,
        y: points[i].y,
      },
      {
        x: points[i + 1].x,
        y: points[i + 1].y,
      },
      {
        x: points[Math.min(i + 2, points.length - 1)].x,
        y: points[Math.min(i + 2, points.length - 1)].y,
      },
    ];

    // Catmull-Rom to Cubic Bezier conversion matrix
    //    0       1       0       0
    //  -1/6      1      1/6      0
    //    0      1/6      1     -1/6
    //    0       0       1       0

    bezierPoints.push([
      {
        x: (-p[0].x + 6 * p[1].x + p[2].x) / 6,
        y: (-p[0].y + 6 * p[1].y + p[2].y) / 6,
      },
      {
        x: (p[1].x + 6 * p[2].x - p[3].x) / 6,
        y: (p[1].y + 6 * p[2].y - p[3].y) / 6,
      },
      {
        x: p[2].x,
        y: p[2].y,
      },
    ]);
  }

  return bezierPoints;
};

const makePath = function (points) {
  var result = 'M' + points[0].x + ',' + points[0].y + ' ';
  var catmull = catmullRom(points);
  for (var i = 0; i < catmull.length; i++) {
    result +=
      'C' +
      catmull[i][0].x +
      ',' +
      catmull[i][0].y +
      ' ' +
      catmull[i][1].x +
      ',' +
      catmull[i][1].y +
      ' ' +
      catmull[i][2].x +
      ',' +
      catmull[i][2].y +
      ' ';
  }
  return result;
};

const useCursor = function (
  svg,
  cursorYAxisTooltipText,
  dataRef,
  pointsRef,
  numberOfPointsRef,
  width
) {
  const [cursor, setCursor] = useState({ visibility: 'hidden' });

  useEffect(
    function () {
      if (svg !== undefined) {
        const mouseEnterListener = function () {
          setCursor(function (value) {
            return {
              ...value,
              visibility: 'visible',
            };
          });
        };

        const mouseLeaveListener = function () {
          setCursor(function (value) {
            return {
              ...value,
              visibility: 'hidden',
            };
          });
        };

        const mouseMoveListener = function (event) {
          const svgRect = svg.getBoundingClientRect();
          if (cursorYAxisTooltipText !== undefined) {
            const textRect = cursorYAxisTooltipText.getBoundingClientRect();
            const i = Math.floor(
              (numberOfPointsRef.current * (event.pageX - svgRect.left)) / width
            );
            if (pointsRef.current[0][i]) {
              setCursor({
                visibility: 'visible',
                pageX: event.pageX,
                yAxisTooltip: {
                  text: [dataRef.current[0][i], dataRef.current[1][i]],
                  x:
                    event.pageX - svgRect.left + 10 + textRect.width <= width
                      ? event.pageX - svgRect.left + 10
                      : event.pageX - svgRect.left - 10 - textRect.width,
                  axis: {
                    x: event.pageX - svgRect.left,
                  },
                  circle: {
                    y: pointsRef.current[0][i].y,
                  },
                  circle2: {
                    y: pointsRef.current[1][i].y,
                  },
                },
              });
              setCursor(function (value) {
                return {
                  ...value,
                  yAxisTooltip: {
                    ...value.yAxisTooltip,
                    y: pointsRef.current[0][i].y - 2 * textRect.height - 20,
                    y2: pointsRef.current[0][i].y - textRect.height - 20,
                    y3: pointsRef.current[0][i].y - 20,
                  },
                };
              });
            }
          } else {
            setCursor(function (value) {
              return {
                ...value,
                visibility: 'hidden',
              };
            });
          }
        };

        svg.addEventListener('mouseenter', mouseEnterListener);
        svg.addEventListener('mouseleave', mouseLeaveListener);
        svg.addEventListener('mousemove', mouseMoveListener);

        return function () {
          svg.removeEventListener('mouseenter', mouseEnterListener);
          svg.removeEventListener('mouseleave', mouseLeaveListener);
          svg.removeEventListener('mousemove', mouseMoveListener);
        };
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [svg]
  );

  return [cursor, setCursor];
};

const useControls = function (
  svg,
  N,
  minNumberOfItems,
  minItemWidth,
  scalingFactor,
  translatingFactor,
  lengthRef
) {
  const [n, setN] = useState(N);
  const nRef = useRef();
  nRef.current = n;
  const [x, setX] = useState(0);

  useEffect(
    function () {
      if (svg !== undefined) {
        let mouseEntered = false;

        const wheelListener = function (event) {
          if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
            setN(function (v) {
              return Math.max(
                Math.min(
                  Math[event.deltaY > 0 ? 'ceil' : 'floor'](
                    v + (event.deltaY * scalingFactor * nRef.current) / N
                  ),
                  svg.getBoundingClientRect().width / minItemWidth
                ),
                minNumberOfItems
              );
            });
          } else {
            setX(function (v) {
              return Math.min(
                Math.max(
                  Math[event.deltaX > 0 ? 'ceil' : 'floor'](
                    v + (event.deltaX * translatingFactor * nRef.current) / N
                  ),
                  nRef.current - lengthRef.current
                ),
                0
              );
            });
          }
        };

        const mouseEnterListener = function () {
          mouseEntered = true;
        };

        const mouseLeaveListener = function () {
          mouseEntered = false;
        };

        const windowWheelListener = function (event) {
          if (mouseEntered === true) {
            event.preventDefault();
          }
        };

        svg.addEventListener('wheel', wheelListener);
        svg.addEventListener('mouseenter', mouseEnterListener);
        svg.addEventListener('mouseleave', mouseLeaveListener);
        window.addEventListener('wheel', windowWheelListener, {
          passive: false,
        });

        return function () {
          svg.removeEventListener('wheel', wheelListener);
          svg.removeEventListener('mouseenter', mouseEnterListener);
          svg.removeEventListener('mouseleave', mouseLeaveListener);
          window.removeEventListener('wheel', windowWheelListener);
        };
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [svg]
  );

  return [n, x];
};

const useChart = function ({
  svg,
  cursorYAxisTooltipText,
  data,
  width,
  height,
  numberOfPoints,
  strokeWidth0,
  minStrokeWidth,
  maxStrokeWidth,
}) {
  const [d, setD] = useState();
  const [d2, setD2] = useState();
  const [d3, setD3] = useState();
  const [d4, setD4] = useState();
  const [padding, setPadding] = useState();
  const [strokeWidth, setStrokeWidth] = useState(strokeWidth0);
  const lengthRef = useRef();
  lengthRef.current = data[0].length;
  const [numberOfPoints2, offset] = useControls(svg, numberOfPoints, 10, 0.01, 1.5, 0.5, lengthRef);
  const numberOfPointsRef = useRef();
  numberOfPointsRef.current = numberOfPoints2;
  const pointsRef = useRef();
  const data2 = data[0].slice(0, offset < 0 ? offset : undefined).slice(-numberOfPoints2);
  const data3 = data[1].slice(0, offset < 0 ? offset : undefined).slice(-numberOfPoints2);
  const dataRef = useRef();
  dataRef.current = [data2, data3];
  const [cursor, setCursor] = useCursor(
    svg,
    cursorYAxisTooltipText,
    dataRef,
    pointsRef,
    numberOfPointsRef,
    width
  );

  useEffect(
    function () {
      if (data && svg !== undefined) {
        const padding =
          2 * (cursorYAxisTooltipText?.getBoundingClientRect().height * 3 + 20) || 100;
        setPadding(padding);
        const height2 = height - padding;
        const { min, max } = extrema(data2.concat(data3));
        const points = data2.map(function (v, i) {
          return {
            y: height2 * (1 - (v - min) / (max - min)) + padding / 2,
            x: (i * width) / (numberOfPoints2 - 1),
          };
        });
        const points2 = data3.map(function (v, i) {
          return {
            y: height2 * (1 - (v - min) / (max - min)) + padding / 2,
            x: (i * width) / (numberOfPoints2 - 1),
          };
        });
        pointsRef.current = [points, points2];

        if (cursor?.pageX !== undefined) {
          const svgRect = svg.getBoundingClientRect();
          const i = Math.floor((numberOfPoints2 * (cursor.pageX - svgRect.left)) / width);
          if (points[i]) {
            setCursor(function (value) {
              const textHeight = cursorYAxisTooltipText?.getBoundingClientRect().height;
              return {
                ...value,
                yAxisTooltip: {
                  ...value?.yAxisTooltip,
                  text: [data2[i], data3[i]],
                  y: points[i].y - 2 * textHeight - 20,
                  y2: points[i].y - textHeight - 20,
                  y3: points[i].y - 20,
                  circle: {
                    y: points[i].y,
                  },
                  circle2: {
                    y: points2[i].y,
                  },
                },
              };
            });
          } else {
            setCursor(function (value) {
              return {
                ...value,
                visibility: 'hidden',
              };
            });
          }
        }

        const path = makePath(points);
        const path2 = makePath(points2);
        setD(path);
        setD2(path + 'V ' + height + ' H ' + 0 + ' V ' + points[0].x);
        setD3(path2);
        setD4(path2 + 'V ' + height + ' H ' + 0 + ' V ' + points2[0].x);
        setStrokeWidth(
          Math.max(
            Math.min((strokeWidth0 * numberOfPoints) / numberOfPoints2, maxStrokeWidth),
            minStrokeWidth
          )
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, offset, numberOfPoints, cursor?.pageX]
  );

  return { d, d2, d3, d4, padding, strokeWidth, cursor };
};

const TimeseriesChart = function ({ data, width, height, withCursor, labels }) {
  const svgRef = useRef();
  const cursorYAxisTooltipTextRef = useRef();
  const { d, d2, d3, d4, padding, strokeWidth, cursor } = useChart({
    svg: svgRef.current,
    cursorYAxisTooltipText: cursorYAxisTooltipTextRef.current,
    data,
    width,
    height,
    numberOfPoints: 300,
    strokeWidth0: 1.5,
    minStrokeWidth: 0.5,
    maxStrokeWidth: 5,
  });

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      ref={svgRef}
    >
      <linearGradient id="fill-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="50%" style={{ stopColor: '#004d46', stopOpacity: 1 }} />
        <stop offset="85%" style={{ stopColor: '#121212', stopOpacity: 1 }} />
      </linearGradient>

      <linearGradient id="stroke-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="50%" style={{ stopColor: '#00ffe9', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#004d46', stopOpacity: 1 }} />
      </linearGradient>

      <linearGradient id="fill-gradient-2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'rgba(255, 94, 8, 0.2)', stopOpacity: 1 }} />
        <stop offset="85%" style={{ stopColor: '#121212', stopOpacity: 1 }} />
      </linearGradient>

      <linearGradient id="stroke-gradient-2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#ffae52', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'rgba(255, 174, 82, 0.1)', stopOpacity: 1 }} />
      </linearGradient>

      <path fill="url(#fill-gradient)" d={d2}></path>
      <path fill="url(#fill-gradient-2)" d={d4}></path>
      <path fill="none" stroke="url(#stroke-gradient)" strokeWidth={strokeWidth} d={d}></path>
      <path fill="none" stroke="url(#stroke-gradient-2)" strokeWidth={strokeWidth} d={d3}></path>

      {withCursor && (
        <>
          <text
            xmlns="http://www.w3.org/2000/svg"
            x={cursor?.yAxisTooltip?.x}
            y={cursor?.yAxisTooltip?.y}
            fill="#00ffe9"
            fontSize="16"
            fontFamily="Inconsolata"
            visibility={cursor?.visibility}
            ref={cursorYAxisTooltipTextRef}
          >
            {labels[0]}: {cursor?.yAxisTooltip?.text[0]}
          </text>
          <text
            xmlns="http://www.w3.org/2000/svg"
            x={cursor?.yAxisTooltip?.x}
            y={cursor?.yAxisTooltip?.y2}
            fill="#ffae52"
            fontSize="16"
            fontFamily="Inconsolata"
            visibility={cursor?.visibility}
          >
            {labels[1]}: {cursor?.yAxisTooltip?.text[1]}
          </text>
          <text
            xmlns="http://www.w3.org/2000/svg"
            x={cursor?.yAxisTooltip?.x}
            y={cursor?.yAxisTooltip?.y3}
            fill="#fff"
            fontSize="16"
            fontFamily="Inconsolata"
            visibility={cursor?.visibility}
          >
            {labels[2]}: {cursor?.yAxisTooltip?.text[0] - cursor?.yAxisTooltip?.text[1]}
          </text>
          {cursor?.yAxisTooltip?.axis && (
            <>
              <g
                xmlns="'http://www.w3.org/2000/svg'"
                fill="none"
                stroke="#777"
                strokeWidth="2"
                visibility={cursor.visibility}
              >
                <path
                  xmlns="'http://www.w3.org/2000/svg'"
                  strokeDasharray="2,4"
                  d={`M${cursor.yAxisTooltip.axis.x} ${padding / 2 - 10} l0 ${
                    height - padding + 20
                  }`}
                />
              </g>
              {cursor.yAxisTooltip.circle && (
                <>
                  <circle
                    cx={cursor.yAxisTooltip.axis.x}
                    cy={cursor.yAxisTooltip.circle.y}
                    r={3 + strokeWidth}
                    stroke="#00ffe9"
                    strokeWidth={strokeWidth}
                    fill="#121212"
                    visibility={cursor.visibility}
                  />
                  <circle
                    cx={cursor.yAxisTooltip.axis.x}
                    cy={cursor.yAxisTooltip.circle2.y}
                    r={3 + strokeWidth}
                    stroke="#ffae52"
                    strokeWidth={strokeWidth}
                    fill="#121212"
                    visibility={cursor.visibility}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </svg>
  );
};

export default TimeseriesChart;
