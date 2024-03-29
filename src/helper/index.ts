interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// 计算两个矩形是否相交
export function isIntersect(rect1: Rect, rect2: Rect) {
  return (
    rect1.x + rect1.width >= rect2.x &&
    rect2.x + rect2.width >= rect1.x &&
    rect1.y + rect1.height >= rect2.y &&
    rect2.y + rect2.height >= rect1.y
  );
}

// 计算图形的矩形区域
export function getRect(
  svgData: Svg | SvgSelector,
  store: Store,
  oneSelected?: boolean
) {
  const {id} = svgData;
  const svg = document.getElementById(id + '-svg') as SVGGraphicsElement | null;
  if (svg) {
    let {x, y, width, height} = oneSelected
      ? svg.getBBox()
      : svg.getBoundingClientRect();
    if (!oneSelected) {
      x -= store.svgCanvasLeft;
      y -= store.svgCanvasTop;
    }
    return {x, y, width, height};
  }
}

// 获取相交的svgData
export function getIntersectSvgData(svgSelector: SvgSelector, store: Store) {
  const rect = getRect(svgSelector, store)!;
  const intersectSvgData: Svg[] = [];
  for (const svgData of store.svgDataList) {
    const svgRect = getRect(svgData, store)!;
    if (isIntersect(rect, svgRect)) {
      intersectSvgData.push(svgData);
    }
  }
  return intersectSvgData;
}

// 计算出最大的选区矩形
export function getMaxRect(
  svgDataList: Svg[],
  store: Store,
  oneSelected?: boolean
) {
  let x = Infinity;
  let y = Infinity;
  let width = 0;
  let height = 0;
  for (const svgData of svgDataList) {
    const rect = getRect(svgData, store, oneSelected)!;
    x = Math.min(x, rect.x);
    y = Math.min(y, rect.y);
    width = Math.max(width, rect.width + rect.x - x);
    height = Math.max(height, rect.height + rect.y - y);
  }
  return x !== Infinity ? {x, y, width, height} : undefined;
}

export function resizeCompute(
  resizeType: string,
  e: MouseEvent,
  store: Store,
  rect: any,
  scale?: number,
  centerScale?: boolean
) {
  let {clientX, clientY} = e;
  const {x, y, width, height} = rect;
  clientX -= store.svgCanvasLeft;
  clientY -= store.svgCanvasTop;

  switch (resizeType) {
    case 'nw':
      rect.width = width + x - clientX;
      rect.height = height + y - clientY;
      rect.x = clientX;
      rect.y = clientY;
      if (rect.width <= 0) {
        resizeType = 'ne';
      } else if (scale) {
        rect.height = rect.width / scale;
        rect.y = y + (height - rect.height);
      }
      if (rect.height <= 0) {
        resizeType = 'sw';
      }
      if (centerScale) {
        rect.width += rect.width - width;
        rect.height += rect.height - height;
      }
      break;
    case 'ne':
      rect.width = clientX - x;
      rect.height = height + y - clientY;
      rect.y = clientY;
      if (rect.width <= 0) {
        resizeType = 'nw';
      } else if (scale) {
        rect.height = rect.width / scale;
        rect.y = y + (height - rect.height);
      }
      if (rect.height <= 0) {
        resizeType = 'se';
      }
      if (centerScale) {
        rect.x -= rect.width - width;
        rect.width += rect.width - width;
        rect.height += rect.height - height;
      }
      break;
    case 'se':
      rect.width = clientX - x;
      rect.height = clientY - y;
      if (rect.width <= 0) {
        resizeType = 'sw';
      } else if (scale) {
        rect.height = rect.width / scale;
      }
      if (rect.height <= 0) {
        resizeType = 'ne';
      }
      if (centerScale) {
        rect.x -= rect.width - width;
        rect.y -= rect.height - height;
        rect.width += rect.width - width;
        rect.height += rect.height - height;
      }
      break;
    case 'sw':
      rect.width = width + x - clientX;
      rect.height = clientY - y;
      rect.x = clientX;
      if (rect.width <= 0) {
        resizeType = 'se';
      } else if (scale) {
        rect.height = rect.width / scale;
      }
      if (rect.height <= 0) {
        resizeType = 'nw';
      }
      if (centerScale) {
        rect.y -= rect.height - height;
        rect.width += rect.width - width;
        rect.height += rect.height - height;
      }
      break;
    case 'n':
      rect.height = height + y - clientY;
      rect.y = clientY;
      if (rect.height <= 0) {
        resizeType = 's';
      } else if (scale) {
        rect.width = rect.height * scale;
        rect.x = x + (width - rect.width) / 2;
      }
      if (centerScale) {
        rect.height += y - clientY;
      }
      break;
    case 'e':
      rect.width = clientX - x;
      if (rect.width <= 0) {
        resizeType = 'w';
      } else if (scale) {
        rect.height = rect.width / scale;
        rect.y = y + (height - rect.height) / 2;
      }
      if (centerScale) {
        const changeWidth = rect.width - width;
        rect.width += changeWidth;
        rect.x -= changeWidth;
      }
      break;
    case 's':
      rect.height = clientY - y;
      if (rect.height <= 0) {
        resizeType = 'n';
      } else if (scale) {
        rect.width = rect.height * scale;
        rect.x = x + (width - rect.width) / 2;
      }

      if (centerScale) {
        const changeHeight = rect.height - height;
        rect.height += changeHeight;
        rect.y -= changeHeight;
      }
      break;
    case 'w':
      rect.width = width + x - clientX;
      rect.x = clientX;
      if (rect.width <= 0) {
        resizeType = 'e';
      } else if (scale) {
        rect.height = rect.width / scale;
        rect.y = y + (height - rect.height) / 2;
      }
      if (centerScale) {
        rect.width += x - clientX;
      }
      break;
  }
  if (rect.width <= 0) {
    rect.width = 1;
  }
  if (rect.height <= 0) {
    rect.height = 1;
  }
  return {rect, resizeType};
}

export function moveCompute(
  startPoint: {x: number; y: number},
  endPoint: {clientX: number; clientY: number},
  rect: any,
  direction?: 'x' | 'y'
) {
  const {clientX, clientY} = endPoint;
  const {x, y} = startPoint;
  const rotate = rect.transform?.rotate
    ? [...rect.transform?.rotate]
    : [0, 0, 0];

  const translate_x = clientX - x;
  const translate_y = clientY - y;

  // 之前想麻烦了，直接同时移动旋转中心就行了
  if (rotate[0] !== 0) {
    rotate[1] += direction === 'y' ? 0 : translate_x;
    rotate[2] += direction === 'x' ? 0 : translate_y;
  }

  const newConfig = {
    x: direction === 'y' ? 0 : rect.x + translate_x,
    y: direction === 'x' ? 0 : rect.y + translate_y,
    transform: {
      ...rect.transform,
      rotate
    }
  };

  return newConfig;
}

export function rotateCompute(
  startPoint: {x: number; y: number; rotate: number},
  endPoint: {clientX: number; clientY: number},
  rect: any,
  store: Store
) {
  const {clientX, clientY} = endPoint;
  const {x, y} = startPoint;
  const {svgCanvasLeft, svgCanvasTop} = store;
  const {x: rectX, y: rectY, width, height} = rect;

  const startX = x - svgCanvasLeft;
  const startY = y - svgCanvasTop;
  const endX = clientX - svgCanvasLeft;
  const endY = clientY - svgCanvasTop;
  const centerX = rectX + width / 2;
  const centerY = rectY + height / 2;

  const startVector = [startX - centerX, startY - centerY];
  const endVector = [endX - centerX, endY - centerY];
  let angle = calculateAngle(startVector, endVector);

  // 判断是顺时针旋转还是逆时针旋转，通过叉乘判断， 叉乘大于0则为顺时针，小于0则为逆时针
  const crossProduct =
    startVector[0] * endVector[1] - startVector[1] * endVector[0];
  if (crossProduct < 0) {
    angle *= -1;
  }

  const transform = {
    rotate: [angle + startPoint.rotate, centerX, centerY]
  };
  return {transform, rotate: [angle, centerX, centerY]};
}

// 计算两个向量之间的夹角
export function calculateAngle([x1, y1]: number[], [x2, y2]: number[]) {
  // 计算两个向量的点积
  const dotProduct = x1 * x2 + y1 * y2;

  // 计算两个向量的模长
  const magnitude1 = Math.sqrt(x1 * x1 + y1 * y1);
  const magnitude2 = Math.sqrt(x2 * x2 + y2 * y2);

  // 计算两个向量之间的夹角（弧度）
  const angle = Math.acos(dotProduct / (magnitude1 * magnitude2));

  // 将弧度转换为角度
  const angleInDegrees = angle * (180 / Math.PI);

  return angleInDegrees;
}

// 已知一个向量和角度，求旋转后的向量
export function rotateVector([x, y]: number[], angle: number) {
  const radian = (angle * Math.PI) / 180;
  const cosTheta = Math.cos(radian);
  const sinTheta = Math.sin(radian);
  const x1 = x * cosTheta - y * sinTheta;
  const y1 = x * sinTheta + y * cosTheta;
  return [x1, y1];
}

/**
 * 计算缩放后的宽高
 */
export function scaleToFit(
  w: number,
  h: number,
  maxWidth: number,
  maxHeight: number
) {
  const aspectRatio = w / h;
  if (w > maxWidth || h > maxHeight) {
    if (aspectRatio > maxWidth / maxHeight) {
      w = maxWidth;
      h = maxWidth / aspectRatio;
    } else {
      h = maxHeight;
      w = maxHeight * aspectRatio;
    }
  }
  return {width: w, height: h};
}

export * from './const';
