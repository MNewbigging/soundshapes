import { observer } from 'mobx-react';
import React from 'react';

import { Beater } from '../../common/types/shapes/Beater';
import { GuiDrawer } from './GuiDrawer';

import './direction-editor.scss';

interface Props {
  beater: Beater;
}

@observer
export class DirectionEditor extends React.Component<Props> {
  public render() {
    const { beater } = this.props;

    return (
      <GuiDrawer buttonText={'D'} className={'direction-editor'}>
        <div className={'label'}>Dir:</div>
        <input
          className={'input'}
          type={'range'}
          min={'0'}
          max={'360'}
          value={beater.rotation}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            beater.setRotation(parseInt(e.target.value, 10))
          }
        />
      </GuiDrawer>
    );
  }
}
