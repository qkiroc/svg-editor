import {keyMap} from '../helper';

export function keyManage(type: 'down' | 'up', e: KeyboardEvent, store: Store) {
  if (type === 'down') {
    store.addKeyBoards(e.key);
  } else {
    keyUp(store.keyBoards, e.key, store);
    store.removeKeyBoards(e.key);
  }
}

// function keyDown(e: KeyboardEvent, store: Store) {}

function keyUp(keys: Set<string>, key: string, store: Store) {
  if (keys.size === 1) {
    const action = keys2Action([key]);
    if (!action) {
      return;
    }
    // 删除
    if (action === 'delete') {
      if (store.selectedIds.length > 0) {
        store.selectedIds.forEach(id => {
          store.removeSvgData(id);
          store.removeSvgSelector(id + '');
        });
        store.setSelectedIds([]);
      }
      return;
    }
    // 工具
    if (['select', 'rect', 'circle', 'line', 'pen', 'text'].includes(action)) {
      store.setToolType(action);
    }
  }
}

export function keys2Action(keys: string[]) {
  keys = keys.sort();
  const key = keys.join('+');
  for (const action of Object.keys(keyMap)) {
    if (keyMap[action].split(',').includes(key)) {
      return action;
    }
  }
}
