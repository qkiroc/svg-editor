import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useStore} from './store';
import SvgLayerRender from './renders/SvgLayerRender';
import cx from 'classnames';

function LayerManage() {
  const store = useStore();
  const svgIconSize = 14;

  const [selectedId, setSelectedId] = useState<number | undefined>();

  function handleDoubleClick(e: React.MouseEvent, id: number) {
    store.setSelectedIds([id]);
    setSelectedId(id);
    e.stopPropagation();
  }
  function handleClick(e: React.MouseEvent, id: number) {
    store.setSelectedIds([id]);
    e.stopPropagation();
  }

  function handleSelectCancel() {
    setSelectedId(id => {
      if (typeof id === 'number') {
        store.setSelectedIds([]);
        return undefined;
      }
      return id;
    });
  }

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) {
    store.updateSvgData(id, {name: e.target.value});
  }

  useEffect(() => {
    document.addEventListener('click', handleSelectCancel);
    return () => {
      document.removeEventListener('click', handleSelectCancel);
    };
  }, []);

  return (
    <div className="SvgEditor-LayerManager">
      <div>图层管理</div>
      <ul>
        {store.svgDataList.map(svgData => {
          if (!svgData.done) {
            return null;
          }
          const isSelected = store.selectedIds.includes(svgData.id);
          return (
            <li
              key={svgData.id}
              className={cx(
                'SvgEditor-LayerManager-items',
                isSelected && 'SvgEditor-LayerManager-items--active'
              )}
              onDoubleClick={e => handleDoubleClick(e, svgData.id)}
              onClick={e => handleClick(e, svgData.id)}
            >
              <svg
                height={svgIconSize}
                width={svgIconSize}
                viewBox={`0 0 ${svgIconSize} ${svgIconSize}`}
                xmlns="http://www.w3.org/2000/svg"
              >
                <SvgLayerRender svgData={svgData} svgIconSize={svgIconSize} />
              </svg>
              {selectedId === svgData.id ? (
                <input
                  type="text"
                  value={svgData.name}
                  onClick={e => {
                    e.stopPropagation();
                  }}
                  onChange={e => handleInputChange(e, svgData.id)}
                />
              ) : (
                <span>{svgData.name}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default observer(LayerManage);
