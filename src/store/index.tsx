import React, {createContext, useContext} from 'react';
import {useLocalStore} from 'mobx-react-lite';
import {svgSelect} from '../manage/svgSelector';

function createStore(): Store {
  return {
    drawing: false,
    toolType: '',
    svgId: 0,
    svgDataList: [],
    svgSelector: [],
    selectedIds: [],
    svgCanvasLeft: 0,
    svgCanvasTop: 0,
    keyBoards: new Set(),
    setSelectedIds(ids: number[]) {
      this.selectedIds = ids;
      svgSelect(this, ids);
    },
    setToolType(type?: string) {
      this.toolType = type || 'select';
    },
    generateSvgId() {
      this.svgId++;
      return this.svgId;
    },
    addSvgData(svgData: any) {
      this.svgDataList.push({...svgData, id: this.svgId});
    },
    hasSvgData(id: number) {
      return !!this.svgDataList.find(svg => svg.id === id);
    },
    getSvgData(id: number) {
      return this.svgDataList.find(svg => svg.id === id)!;
    },
    removeSvgData(id: number) {
      this.svgDataList = this.svgDataList.filter(svg => svg.id !== id);
    },
    updateSvgData(id: number, svgData: Omit<Svg, 'id'>) {
      const index = this.svgDataList.findIndex(svg => svg.id === id);
      this.svgDataList[index] = {...this.svgDataList[index], ...svgData};
    },
    clearSvgData() {
      this.svgDataList = [];
    },
    addSvgSelector(svgSelector: SvgSelector) {
      this.svgSelector.push(svgSelector);
    },
    hasSvgSelector(id: string) {
      return !!this.svgSelector.find(svg => svg.id === id);
    },
    getSvgSelector(id: string) {
      return this.svgSelector.find(svg => svg.id === id)!;
    },
    removeSvgSelector(id: string) {
      this.svgSelector = this.svgSelector.filter(svg => svg.id !== id);
    },
    removeSvgSelectorByType(type: string) {
      this.svgSelector = this.svgSelector.filter(svg => svg.type !== type);
    },
    updateSvgSelector(id: string, svgData: SvgSelector) {
      const index = this.svgSelector.findIndex(svg => svg.id === id);
      this.svgSelector[index] = {...this.svgSelector[index], ...svgData};
    },
    clearSvgSelector() {
      this.svgSelector = [];
    },
    addKeyBoards(key: string) {
      this.keyBoards.add(key);
    },
    removeKeyBoards(key: string) {
      this.keyBoards.delete(key);
    }
  };
}

export const StoreContext = createContext<Store | null>(null);

export const StoreProvider = ({children}: {children: React.ReactNode}) => {
  const store = useLocalStore(createStore);
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = useContext(StoreContext);
  return store!;
};
