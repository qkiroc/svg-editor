interface Svg {
  id: number;
  type: string;
  toolType: string;
  done: boolean;
  [key: string]: any;
}

interface SvgSelector {
  type: string;
  id?: string;
  [key: string]: any;
}

interface SvgTool {
  type: string;
  icon: string;
  name: string;
  cursor: string;
  onMouseDown: (e: MouseEvent, store: Store) => void;
  onMouseMove: (e: MouseEvent, store: Store) => void;
  onMouseUp: (e: MouseEvent, store: Store) => void;
  init?: (store: Store) => void;
  onSelectedDown?: (e: MouseEvent, svgDataId: number, store: Store) => void;
  onSelectedMove?: (e: MouseEvent, svgDataId: number, store: Store) => void;
  onSelectedUp?: (e: MouseEvent, svgDataId: number, store: Store) => void;
}

interface Store {
  drawing: boolean;
  toolType: string;
  svgId: number;
  svgDataList: Svg[];
  svgSelector: SvgSelector[];
  selectedIds: number[];
  svgCanvasLeft: number;
  svgCanvasTop: number;
  keyBoards: Set<string>;
  setSelectedIds(ids: number[]): void;
  setToolType(type?: string): void;
  generateSvgId: () => number;
  addSvgData: (svgData: any) => void;
  hasSvgData: (id: number) => boolean;
  getSvgData: (id: number) => Svg;
  removeSvgData: (id: number) => void;
  updateSvgData: (id: number, svgData: any) => void;
  clearSvgData: () => void;
  addSvgSelector: (svgSelector: SvgSelector) => void;
  hasSvgSelector: (id: string) => boolean;
  getSvgSelector: (id: string) => SvgSelector;
  removeSvgSelector: (id: string) => void;
  removeSvgSelectorByType: (type: string) => void;
  updateSvgSelector: (id: string, svgSelector: any) => void;
  clearSvgSelector: () => void;
  addKeyBoards: (key: string) => void;
  removeKeyBoards: (key: string) => void;
}

interface PlainObject<T = any> {
  [propsName: string]: T;
}
