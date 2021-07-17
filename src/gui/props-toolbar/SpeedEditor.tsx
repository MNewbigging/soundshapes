import { observer } from 'mobx-react';
import React from 'react';

import './speed-editor.scss';

@observer
export class SpeedEditor extends React.Component {
  public render() {
    return (
      <div className={'drawer-parent speed-editor'}>
        <div className={'ui-button'}>S</div>
        <div className={'drawer speed-drawer'}>
          <div className={'label'}>Speed:</div>
          <input className={'input'} type={'number'} />
        </div>
      </div>
    );
  }
}
