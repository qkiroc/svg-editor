import React, {useEffect} from 'react';
import {useStore} from './store';
import SvgRender from './renders/SvgRender';
import './tools/index';
import {getSvgTool, getSvgTools, toolsManage} from './manage/svgTools';
import {observer} from 'mobx-react-lite';
import SvgSelectorRender from './renders/SvgSelectorRender';
import {keyManage} from './manage/keyManage';

function SvgEditor() {
  const store = useStore();

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
    const container = svgCanvas.getBoundingClientRect();
    store.svgCanvasLeft = container.left;
    store.svgCanvasTop = container.top;
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
        <svg ref={handleSvgCanvasRef}>
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
