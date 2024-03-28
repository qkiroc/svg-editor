export const defaultStyle = {
  fill: '#d8d8d8',
  stroke: '#979797',
  strokeWidth: '1'
};

export const keyMap: PlainObject = {
  delete: 'Backspace', // 删除
  uniformScale: 'Shift+resize', // 等比缩放
  centerScale: 'Alt+resize', // 中心缩放
  centerUniformScale: 'Alt+Shift+resize', // 中心等比缩放
  rotation: 'Meta+move', // 旋转
  copy: 'Meta+c,Alt+move', // 复制
  magneticMove: 'Shift+move', // 磁性移动
  magneticCopyMove: 'Alt+Shift+move', // 复制且磁性移动
  // 工具类
  rect: 'r',
  select: 'q'
};

export const hotsPotSize = 6;
export const halfHotsPotSize = hotsPotSize / 2;
export const whitespace = 0;
