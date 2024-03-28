import {getMaxRect} from '../helper';

export function svgSelect(store: Store, ids: number[]) {
  store.removeSvgSelector('max-area');
  store.removeSvgSelectorByType('stroke-light');
  if (ids.length === 0) {
    return;
  }
  const intersectSvgData = ids.map(id => store.getSvgData(id));

  let rect: any;

  if (intersectSvgData.length === 1) {
    rect = getMaxRect(intersectSvgData, store, true);
    rect.transform = intersectSvgData[0].transform;
  } else {
    rect = getMaxRect(intersectSvgData, store);
  }

  for (const svgData of intersectSvgData) {
    if (store.hasSvgSelector(svgData.id + '')) {
      store.updateSvgSelector(svgData.id + '', {
        ...svgData,
        id: svgData.id + '',
        type: 'stroke-light'
      });
    } else {
      store.addSvgSelector({
        ...svgData,
        id: svgData.id + '',
        type: 'stroke-light'
      });
    }
  }
  store.addSvgSelector({
    ...rect,
    type: 'max-area',
    id: 'max-area'
  });
}

export function copySvgData(ids: number[], store: Store) {
  const selectedSvgDataList = ids.map(id => store.getSvgData(id));
  const newSvgDataIdList = selectedSvgDataList.map(svgData => {
    const newSvgData = {...svgData, id: store.generateSvgId()};
    store.addSvgData(newSvgData);
    return newSvgData.id;
  });
  return newSvgDataIdList;
}
