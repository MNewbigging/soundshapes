import { observer } from 'mobx-react';
import React from 'react';
import NumericInput from 'react-numeric-input';

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
        <NumericInput
          className={'dir-input'}
          autoComplete={'off'}
          style={false}
          min={0}
          max={360}
          step={1}
          precision={0}
          value={beater.rotation}
          onChange={(num: number) => beater.setRotation(num)}
        />
      </GuiDrawer>
    );
  }
}
