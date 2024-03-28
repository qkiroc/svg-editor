// 矩形工具
import {rotateVector} from '../helper';
import {registerSvgTool} from '../manage/svgTools';

function rectTool(): SvgTool {
  let startPoint: {x: number; y: number} | undefined;

  function handleMouseDown(e: MouseEvent, store: Store) {
    const {clientX, clientY} = e;
    startPoint = {x: clientX, y: clientY};
  }

  function handleMouseMove(e: MouseEvent, store: Store) {
    if (!store.drawing || !startPoint) {
      return;
    }

    const {clientX, clientY} = e;
    const x = Math.min(startPoint.x, clientX) - store.svgCanvasLeft;
    const y = Math.min(startPoint.y, clientY) - store.svgCanvasTop;
    const width = Math.abs(startPoint.x - clientX);
    const height = Math.abs(startPoint.y - clientY);
    if (store.hasSvgData(store.svgId)) {
      store.updateSvgData(store.svgId, {
        toolType: 'rect',
        type: 'rect',
        x,
        y,
        width,
        height
      });
    } else {
      store.addSvgData({
        name: '矩形',
        toolType: 'rect',
        type: 'rect',
        x,
        y,
        width,
        height
      });
    }
  }

  function handleMouseUp(e: MouseEvent, store: Store) {
    startPoint = undefined;
    const id = store.svgId;
    store.setSelectedIds([id]);
    store.updateSvgData(id, {done: true});
    store.generateSvgId();
  }

  return {
    type: 'rect',
    icon: 'rect',
    name: '矩形',
    cursor: 'crosshair',
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp
  };
}

registerSvgTool(rectTool());

export function rectRotate(rotate: number[], id: number, store: Store) {
  const svgData = store.getSvgData(id);
  const {__preX, __preY, __preTransform, width, height} = svgData;
  const cx = __preX + width / 2;
  const cy = __preY + height / 2;
  const preRotate = __preTransform?.rotate || [0, cx, cy];

  const newCenter = rotateVector(
    [rotate[1] - cx, rotate[2] - cy],
    rotate[0] + preRotate[0]
  );

  const newConfig = {
    x: rotate[1] - newCenter[0] - width / 2,
    y: rotate[2] - newCenter[1] - height / 2,
    transform: {
      ...(svgData.transform || {}),
      rotate: [
        rotate[0] + preRotate[0],
        rotate[1] - newCenter[0],
        rotate[2] - newCenter[1]
      ]
    }
  };
  store.updateSvgData(id, {
    ...newConfig
  });
  store.updateSvgSelector(id + '', {
    ...newConfig
  });
}

export function rectMove(
  move: number[],
  id: number,
  isOne: boolean,
  store: Store
) {
  const svgData = store.getSvgData(id);
  const {x, y} = svgData;
  const rotate = svgData.transform?.rotate[0] || 0;
  const radian = (rotate * Math.PI) / 180;
  const cosTheta = Math.cos(radian);
  const sinTheta = Math.sin(radian);
  let newConfig = {
    x: x + move[0],
    y: y + move[1]
  };
  // 选中的如果不是一个元素，就需要考虑旋转，单独计算
  if (!isOne) {
    newConfig = {
      x: x + move[0] * cosTheta + move[1] * sinTheta,
      y: y + move[1] * cosTheta - move[0] * sinTheta
    };
  }
  store.updateSvgData(id, {
    ...newConfig
  });
  store.updateSvgSelector(id + '', {
    ...newConfig
  });
}
