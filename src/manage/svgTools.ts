const svgToolMap = new Map<string, SvgTool>();

// 注册svg工具
export function registerSvgTool(tool: SvgTool) {
  const {type} = tool;
  if (svgToolMap.has(type)) {
    throw new Error(`工具${type}已经存在`);
  } else {
    svgToolMap.set(type, tool);
  }
}

// 移除svg工具
export function unregisterSvgTool(type: string) {
  svgToolMap.delete(type);
}

// 获取svg工具
export function getSvgTools() {
  // 将map转换为数组
  return Array.from(svgToolMap.values());
}

// 获取当前工具
export function getSvgTool(type: string) {
  const tool = svgToolMap.get(type);
  return tool!;
}

export function toolsManage(
  type: 'onMouseDown' | 'onMouseMove' | 'onMouseUp',
  e: MouseEvent,
  store: Store
) {
  const tooType = store.toolType;
  const tool = svgToolMap.get(tooType);
  if (tool) {
    tool[type](e, store);
  }
}
