import { observer } from 'mobx-react';
import React from 'react';
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
        <input
          className={'input'}
          type={'number'}
          value={shape.scale}
          onChange={this.onChangeScale}
        />
      </GuiDrawer>
    );
  }

  private readonly onChangeScale = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { shape } = this.props;

    // shape.setScale(parseInt(e.target.value, 10));
    const scale = parseInt(e.target.value, 10);
    eventManager.fire({ e: EventType.SCALE_SHAPE, scale });
  };
}
