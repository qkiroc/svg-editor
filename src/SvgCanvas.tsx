import React, {useEffect, useState} from 'react';
import {useStore} from './store';
import SvgRender from './renders/SvgRender';
import './tools/index';
import {getSvgTool, getSvgTools, toolsManage} from './manage/svgTools';
import {observer} from 'mobx-react-lite';
import SvgSelectorRender from './renders/SvgSelectorRender';
import {keyManage} from './manage/keyManage';
import {debounce} from 'lodash';

function SvgEditor() {
  const store = useStore();
  const [viewBox, setViewBox] = useState([0, 0, 0, 0]);

  const svgTool = getSvgTools();

  // 选择工具
  function setToolType(type: string) {
    store.setToolType(type);
  }

  function handleMouseDown(e: MouseEvent) {
    store.drawing = true;
    toolsManage('onMouseDown', e, store);
  }

  function handleMouseMove(e: MouseEvent) {
    toolsManage('onMouseMove', e, store);
  }

  function handleMouseUp(e: MouseEvent) {
    store.drawing = false;
    toolsManage('onMouseUp', e, store);
    store.setToolType();
  }

  function handleKeyDown(e: KeyboardEvent) {
    keyManage('down', e, store);
  }

  function handleKeyUp(e: KeyboardEvent) {
    keyManage('up', e, store);
  }

  const handleMouseWheel = debounce((e: WheelEvent) => {
    e.preventDefault();
    let scale = 1;
    if (e.deltaY < 0) {
      scale = -1;
    }
    console.log('wheel', e.deltaY);
    setViewBox(viewBox => {
      viewBox[2] += scale;
      viewBox[3] += scale;

      if (viewBox[2] < 100) {
        viewBox[2] = 100;
      }
      if (viewBox[3] < 500) {
        viewBox[3] = 500;
      }

      return [...viewBox];
    });
    document.removeEventListener('wheel', handleMouseWheel);
  }, 100);

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  function handleSvgCanvasRef(svgCanvas: SVGSVGElement) {
    if (!svgCanvas) {
      return;
    }
    svgCanvas.addEventListener(
      'wheel',
      e => {
        console.log('wheel', e.deltaY, e);
        e.preventDefault();
        // handleMouseWheel(e);
      },
      {passive: false}
    );
    const container = svgCanvas.getBoundingClientRect();
    store.svgCanvasLeft = container.left;
    store.svgCanvasTop = container.top;
    const {width, height} = container;
    if (viewBox[2] === 0 && viewBox[3] === 0) {
      setViewBox([0, 0, width, height]);
    }
  }

  return (
    <div className="SvgEditor-Canvas">
      <div>SVG 编辑器</div>
      <div className="SvgEditor-Tools">
        {svgTool.map(tool => {
          return (
            <button
              className={
                store.toolType === tool.type
                  ? 'Editor-Tool--active'
                  : 'Editor-Tool'
              }
              key={tool.type}
              onClick={e => setToolType(tool.type)}
            >
              {tool.name}
            </button>
          );
        })}
      </div>
      <div
        className="SvgEditor-Canvas"
        style={{cursor: getSvgTool(store.toolType)?.cursor}}
      >
        <svg ref={handleSvgCanvasRef} viewBox={viewBox.join(' ')}>
          {store.svgDataList.map(svgData => {
            return <SvgRender svgData={svgData} key={svgData.id} />;
          })}
          <g>
            {store.svgSelector.map(svgSelector => {
              return (
                <SvgSelectorRender
                  store={store}
                  svgSelector={svgSelector}
                  key={svgSelector.id}
                />
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
export default observer(SvgEditor);
