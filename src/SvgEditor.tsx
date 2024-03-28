import React from 'react';
import { StoreProvider } from './store';
import SvgCanvas from './SvgCanvas';
import LayerManage from './LayerManage';

export default function SvgEditor() {
  return (
    <StoreProvider>
      <div>
        <div></div>
        <div className='SvgEditor-Main'>
          <LayerManage />
          <SvgCanvas />
        </div>
      </div>
    </StoreProvider>
  );
}
