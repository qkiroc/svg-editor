import {
  getIntersectSvgData,
  hotsPotSize,
  moveCompute,
  resizeCompute,
  rotateCompute
} from '../helper';
import {keys2Action} from '../manage/keyManage';
import {copySvgData} from '../manage/svgSelector';
import {registerSvgTool} from '../manage/svgTools';
import {rectMove, rectRotate} from './rect';

function selectTool(): SvgTool {
  let startPoint: {x: number; y: number} | undefined;
  let resizeType: string | undefined;
  let isMove = false;
  let action: string | undefined;
  let magneticMoveDirection: 'x' | 'y' | undefined;
  let uniformScale = false;
  let scale: number | undefined = undefined;
  let isRotate = false;
  let startRotate: number = 0;

  function handleMouseDown(e: MouseEvent, store: Store) {
    const target = e.target as any;

    if (target.tagName !== 'svg') {
      const id = parseInt(target.id);

      if (store.hasSvgSelector('max-area')) {
        const rect = store.getSvgSelector('max-area');
        const {x, y, width, height} = rect;
        const containerX = e.clientX - store.svgCanvasLeft;
        const containerY = e.clientY - store.svgCanvasTop;
        const halfHotsPotSize = hotsPotSize / 2;
        if (
          containerX > x + halfHotsPotSize &&
          containerX < x + width - halfHotsPotSize &&
          containerY > y + halfHotsPotSize &&
          containerY < y + height - halfHotsPotSize
        ) {
          isMove = true;
        }
      }
      if (store.hasSvgData(id)) {
        store.setSelectedIds([id]);
        isMove = true;
      } else if (target.id.includes('resize')) {
        resizeType = target.id.split('-')[2];
      }
    } else {
      store.clearSvgSelector();
      store.selectedIds = [];
    }
    if (store.keyBoards.size > 0) {
      action = keys2Action([...store.keyBoards, 'move']);
      if (action && ['magneticCopyMove', 'copy'].includes(action) && isMove) {
        const newSvgDataIdList = copySvgData(store.selectedIds, store);
        store.setSelectedIds([...newSvgDataIdList]);
      }

      if (
        action &&
        ['rotation'].includes(action) &&
        target.id.includes('resize')
      ) {
        isRotate = true;
        store.selectedIds.forEach(id => {
          const svgData = store.getSvgData(id);
          store.updateSvgData(id, {
            __preX: svgData.x,
            __preY: svgData.y,
            __preTransform: {...svgData.transform}
          });
        });
        const rect = store.getSvgSelector('max-area');
        startRotate = rect?.transform?.rotate[0] || 0;
      }
    }

    startPoint = {x: e.clientX, y: e.clientY};
  }

  function handleMouseMove(e: MouseEvent, store: Store) {
    // 选择区域
    if (startPoint && !resizeType && !isMove) {
      const x = Math.min(startPoint.x, e.clientX) - store.svgCanvasLeft;
      const y = Math.min(startPoint.y, e.clientY) - store.svgCanvasTop;
      const width = Math.abs(startPoint.x - e.clientX);
      const height = Math.abs(startPoint.y - e.clientY);
      if (store.hasSvgSelector('select-area')) {
        store.updateSvgSelector('select-area', {
          x,
          y,
          width,
          height,
          type: 'select-area'
        });
      } else {
        store.addSvgSelector({
          id: 'select-area',
          x,
          y,
          width,
          height,
          type: 'select-area'
        });
      }

      // 计算相交的svgData
      const intersectSvgData = getIntersectSvgData(
        store.getSvgSelector('select-area'),
        store
      );

      store.setSelectedIds(intersectSvgData.map(svg => svg.id));
      return;
    }

    // 旋转
    if (startPoint && isRotate) {
      const rect = store.getSvgSelector('max-area');

      const res = rotateCompute(
        {...startPoint, rotate: startRotate},
        e,
        rect,
        store
      );
      store.updateSvgSelector('max-area', {transform: res.transform});
      store.selectedIds.forEach(id => {
        rectRotate(res.rotate, id, store);
      });
      return;
    }

    // 移动
    if (startPoint && isMove) {
      const rect = store.getSvgSelector('max-area');
      const {x, y} = rect;
      action = keys2Action([...store.keyBoards, 'move']);
      if (action && ['magneticCopyMove', 'magneticMove'].includes(action)) {
        const {clientX, clientY} = e;
        const {x, y} = startPoint;
        if (clientX - x && clientY - y && !magneticMoveDirection) {
          magneticMoveDirection = clientX - x > clientY - y ? 'x' : 'y';
        }
      } else {
        magneticMoveDirection = undefined;
      }

      const newRect = moveCompute(startPoint, e, rect, magneticMoveDirection);
      store.updateSvgSelector('max-area', newRect);
      const translate_x = newRect.x - x;
      const translate_y = newRect.y - y;
      const isOne = store.selectedIds.length === 1;
      store.selectedIds.forEach(id => {
        rectMove([translate_x, translate_y], id, store);
      });
      startPoint = {x: e.clientX, y: e.clientY};
      return;
    }
    // 缩放
    if (resizeType) {
      const rect = store.getSvgSelector('max-area');
      const {x, y, width, height} = rect;
      action = keys2Action([...store.keyBoards, 'resize']);
      // 等比缩放
      if (
        action &&
        ['uniformScale', 'centerUniformScale'].includes(action) &&
        !uniformScale
      ) {
        uniformScale = true;
        scale = width / height;
      }
      let centerScale = false;
      // 中心缩放
      if (action && ['centerScale', 'centerUniformScale'].includes(action)) {
        centerScale = true;
      }

      const res = resizeCompute(resizeType, e, store, rect, scale, centerScale);
      resizeType = res.resizeType;
      const newRect = res.rect;
      store.updateSvgSelector('max-area', newRect);
      // 计算出变化的比例
      const selectedSvgDataList = store.selectedIds.map(id =>
        store.getSvgData(id)
      );

      const scale_x = newRect.width / width;
      const scale_y = newRect.height / height;
      const translate_x = newRect.x - x;
      const translate_y = newRect.y - y;

      for (const selectedSvgData of selectedSvgDataList) {
        const {x: x1, y: y1, width: width1, height: height1} = selectedSvgData;
        store.updateSvgData(selectedSvgData.id, {
          ...selectedSvgData,
          x: scale_x * (x1 - x) + translate_x + x,
          y: scale_y * (y1 - y) + translate_y + y,
          width: scale_x * width1,
          height: scale_y * height1
        });
        store.updateSvgSelector(selectedSvgData.id + '', {
          x: scale_x * (x1 - x) + translate_x + x,
          y: scale_y * (y1 - y) + translate_y + y,
          width: scale_x * width1,
          height: scale_y * height1
        });
      }
      return;
    }
  }

  function handleMouseUp(e: MouseEvent, store: Store) {
    if (store.hasSvgSelector('select-area')) {
      store.removeSvgSelector('select-area');
    }
    startPoint = undefined;
    resizeType = '';
    isMove = false;
    magneticMoveDirection = undefined;
    uniformScale = false;
    scale = undefined;
    isRotate = false;
    action = '';
  }

  return {
    icon: 'select',
    name: '选择',
    type: 'select',
    cursor: 'default',
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp
  };
}

registerSvgTool(selectTool());
