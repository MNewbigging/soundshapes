import { observer } from 'mobx-react';
import React from 'react';
import { eventManager, EventType } from '../../common/EventManager';

import { Shape } from '../../common/types/shapes/Shape';

import './scale-editor.scss';

interface Props {
  shape: Shape;
}

@observer
export class ScaleEditor extends React.Component<Props> {
  public render() {
    const { shape } = this.props;

    return (
      <div className={'drawer-parent scale-editor'}>
        <div className={'ui-button'}>Sc</div>
        <div className={'drawer scale-drawer'}>
          <div className={'label'}>Scale:</div>
          <input
            className={'input'}
            type={'number'}
            value={shape.scale}
            onChange={this.onChangeScale}
          />
        </div>
      </div>
    );
  }

  private readonly onChangeScale = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { shape } = this.props;

    // shape.setScale(parseInt(e.target.value, 10));
    const scale = parseInt(e.target.value, 10);
    eventManager.fire({ e: EventType.SCALE_SHAPE, scale });
  };
}
