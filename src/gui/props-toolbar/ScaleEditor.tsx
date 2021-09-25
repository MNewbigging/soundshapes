import { observer } from 'mobx-react';
import React from 'react';
import NumericInput from 'react-numeric-input';
import { eventManager, EventType } from '../../common/EventManager';

import { Shape } from '../../common/types/shapes/Shape';
import { GuiDrawer } from './GuiDrawer';

import './scale-editor.scss';

interface Props {
  shape: Shape;
}

@observer
export class ScaleEditor extends React.Component<Props> {
  public render() {
    const { shape } = this.props;

    return (
      <GuiDrawer buttonText={'Sc'} className={'scale-editor'}>
        <div className={'label'}>Scale:</div>
        <NumericInput
          className={'scale-input'}
          autoComplete={'off'}
          style={false}
          precision={2}
          value={shape.scale}
          onChange={(n: number) => this.onChangeScale(n)}
        />
      </GuiDrawer>
    );
  }

  private readonly onChangeScale = (scale: number) => {
    const { shape } = this.props;

    eventManager.fire({ e: EventType.SCALE_SHAPE, scale });
  };
}
