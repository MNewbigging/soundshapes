import { observer } from 'mobx-react';
import React from 'react';

import { Beater } from '../../common/types/shapes/Beater';

import './speed-editor.scss';

interface Props {
  beater: Beater;
}

@observer
export class SpeedEditor extends React.Component<Props> {
  public render() {
    const { beater } = this.props;

    return (
      <div className={'drawer-parent speed-editor'}>
        <div className={'ui-button'}>S</div>
        <div className={'drawer speed-drawer'}>
          <div className={'label'}>Speed:</div>
          <input
            className={'input'}
            type={'number'}
            value={beater.speed}
            onChange={this.onChangeSpeed}
          />
        </div>
      </div>
    );
  }

  private readonly onChangeSpeed = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { beater } = this.props;

    beater.setSpeed(parseInt(e.target.value, 10));
  };
}
