import { observer } from 'mobx-react';
import React from 'react';

import { Beater } from '../../common/types/shapes/Beater';
import { GuiDrawer } from './GuiDrawer';

import './speed-editor.scss';

interface Props {
  beater: Beater;
}

@observer
export class SpeedEditor extends React.Component<Props> {
  public render() {
    const { beater } = this.props;

    return (
      <GuiDrawer buttonText={'S'} className={'speed-editor'}>
        <div className={'label'}>Speed:</div>
        <input
          className={'input'}
          type={'number'}
          value={beater.speed}
          onChange={this.onChangeSpeed}
        />
      </GuiDrawer>
    );
  }

  private readonly onChangeSpeed = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { beater } = this.props;

    beater.setSpeed(parseInt(e.target.value, 10));
  };
}
