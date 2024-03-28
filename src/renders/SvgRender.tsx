import React from 'react';
import {defaultStyle} from '../helper';

export default function SvgRender({svgData}: {svgData: Svg}) {
  // 根据svgData的type来渲染不同的svg
  const {type, id, x, y, transform} = svgData;

  const transformStr =
    transform &&
    Object.keys(transform)
      .map(k => {
        return `${k}(${transform[k].join(',')})`;
      })
      .join(' ');

  if (type === 'rect') {
    return (
      <rect
        id={id + '-svg'}
        x={x}
        y={y}
        width={svgData.width}
        height={svgData.height}
        fill={svgData.fill || defaultStyle.fill}
        stroke={svgData.stroke || defaultStyle.stroke}
        strokeWidth={svgData.strokeWidth || defaultStyle.strokeWidth}
        transform={transformStr}
      ></rect>
    );
  } else if (type === 'circle') {
    return (
      <circle
        id={id + '-svg'}
        cx={svgData.cx}
        cy={svgData.cy}
        r={svgData.r}
        fill="transparent"
        stroke="black"
        strokeWidth="1"
      ></circle>
    );
  } else if (type === 'ellipse') {
    return (
      <ellipse
        id={id + '-svg'}
        cx={svgData.cx}
        cy={svgData.cy}
        rx={svgData.rx}
        ry={svgData.ry}
        fill="transparent"
        stroke="black"
        strokeWidth="1"
      ></ellipse>
    );
  } else if (type === 'line') {
    return (
      <line
        id={id + '-svg'}
        x1={svgData.x1}
        y1={svgData.y1}
        x2={svgData.x2}
        y2={svgData.y2}
        stroke="black"
        strokeWidth="1"
      ></line>
    );
  } else if (type === 'path') {
    return (
      <path
        id={id + '-svg'}
        d={svgData.d}
        fill="transparent"
        stroke="black"
        strokeWidth="1"
      ></path>
    );
  }
}
