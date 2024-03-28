import React from 'react';
import {scaleToFit, defaultStyle} from '../helper';

export default function SvgLayerRender({
  svgData,
  svgIconSize
}: {
  svgData: Svg;
  svgIconSize: number;
}) {
  // 根据svgData的type来渲染不同的svg
  const {type, id, x, y} = svgData;

  if (type === 'rect') {
    const {width, height} = scaleToFit(
      svgData.width,
      svgData.height,
      svgIconSize,
      svgIconSize
    );
    return (
      <rect
        id={id + '-svg-icon'}
        x={width > height ? 0 : (svgIconSize - width) / 2}
        y={width > height ? (svgIconSize - height) / 2 : 0}
        width={width}
        height={height}
        strokeWidth={defaultStyle.strokeWidth}
      ></rect>
    );
  } else if (type === 'circle') {
    return (
      <circle
        id={id + '-svg-icon'}
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
        id={id + '-svg-icon'}
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
        id={id + '-svg-icon'}
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
        id={id + '-svg-icon'}
        d={svgData.d}
        fill="transparent"
        stroke="black"
        strokeWidth="1"
      ></path>
    );
  }
}
