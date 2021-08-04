import NumericInput from 'react-numeric-input';
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
        <NumericInput
          className={'number-input'}
          autoComplete={'off'}
          style={false}
          min={0}
          max={12}
          precision={1}
          value={beater.speed}
          onChange={(num: number) => {
            beater.setSpeed(num);
          }}
        />
      </GuiDrawer>
    );
  }
}
