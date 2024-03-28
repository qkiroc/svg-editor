import React from 'react';
import {hotsPotSize, whitespace} from '../helper';
import {keys2Action} from '../manage/keyManage';
import cx from 'classnames';
import {observer} from 'mobx-react-lite';

export default observer(function SvgSelectorRender({
  svgSelector,
  store
}: {
  svgSelector: SvgSelector;
  store: Store;
}) {
  // 根据svgSelector的type来渲染不同的svg
  let {type, id, x, y, width, height, transform} = svgSelector;
  const halfHotsPotSize = hotsPotSize / 2;
  const transformStr =
    transform &&
    Object.keys(transform)
      .map(k => {
        return `${k}(${transform[k].join(',')})`;
      })
      .join(' ');
  if (type === 'max-area') {
    x -= whitespace;
    y -= whitespace;
    width += whitespace * 2;
    height += whitespace * 2;
    const resizeRect = [
      {
        id: 'nw-resize',
        x: x - halfHotsPotSize,
        y: y - halfHotsPotSize
      },
      {
        id: 'n-resize',
        x: x + halfHotsPotSize,
        y: y - halfHotsPotSize,
        width: width - hotsPotSize
      },
      {
        id: 'ne-resize',
        x: x + width - halfHotsPotSize,
        y: y - halfHotsPotSize
      },
      {
        id: 'e-resize',
        x: x + width - halfHotsPotSize,
        y: y + halfHotsPotSize,
        height: height - hotsPotSize
      },
      {
        id: 'se-resize',
        x: x + width - halfHotsPotSize,
        y: y + height - halfHotsPotSize
      },
      {
        id: 's-resize',
        x: x + halfHotsPotSize,
        y: y + height - halfHotsPotSize,
        width: width - hotsPotSize
      },
      {
        id: 'sw-resize',
        x: x - halfHotsPotSize,
        y: y + height - halfHotsPotSize
      },
      {
        id: 'w-resize',
        x: x - halfHotsPotSize,
        y: y + halfHotsPotSize,
        height: height - hotsPotSize
      }
    ];
    const action = keys2Action([...store.keyBoards, 'move']);
    let isRotate = false;
    if (action === 'rotation') {
      isRotate = true;
    }
    return (
      <g transform={transformStr}>
        <rect
          id={id + '-svg'}
          x={x}
          y={y}
          width={width}
          height={height}
          fill="transparent"
          stroke="#aaaaaa"
          strokeWidth="0.5"
        ></rect>
        {resizeRect.map((resize, index) => (
          <rect
            className={cx(
              'resize-rect',
              resize.id,
              isRotate && 'resize-rect-rotate'
            )}
            key={resize.id}
            id={id + '-' + resize.id}
            x={resize.x}
            y={resize.y}
            height={resize.height || hotsPotSize}
            width={resize.width || hotsPotSize}
            fill={index % 2 === 0 ? '#ffffff' : 'transparent'}
            stroke={index % 2 === 0 ? '#aaaaaa' : 'transparent'}
            strokeWidth="0.2"
          ></rect>
        ))}
      </g>
    );
  } else if (type === 'select-area') {
    return (
      <rect
        id={id + '-svg'}
        x={x}
        y={y}
        width={width}
        height={height}
        fill="#d8d8d85e"
        stroke="#b7b7b7"
        strokeWidth="0.5"
      ></rect>
    );
  } else if (type === 'stroke-light') {
    x -= whitespace;
    y -= whitespace;
    width += whitespace * 2;
    height += whitespace * 2;
    return (
      <rect
        id={id + '-svg-light'}
        x={x}
        y={y}
        width={width}
        height={height}
        fill="transparent"
        stroke="#FF5C02"
        strokeWidth="0.5"
        transform={transformStr}
      ></rect>
    );
  }
});
