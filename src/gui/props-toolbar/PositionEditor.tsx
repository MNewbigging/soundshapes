import { observer } from 'mobx-react';
import React from 'react';
import * as THREE from 'three';
import NumericInput from 'react-numeric-input';

import { eventManager, EventType } from '../../common/EventManager';
import { Shape } from '../../common/types/shapes/Shape';
import { GuiDrawer } from './GuiDrawer';

import './position-editor.scss';

interface Props {
  shape: Shape;
}

@observer
export class PositionEditor extends React.Component<Props> {
  public render() {
    const { shape } = this.props;

    return (
      <GuiDrawer buttonText={'P'} className={'position-editor'}>
        <div className={'label'}>X: </div>
        <NumericInput
          className={'number-input'}
          autoComplete={'off'}
          style={false}
          precision={3}
          value={shape.posX}
          onChange={(num: number) => this.setPosX(num)}
        />

        <div className={'label'}>Y:</div>
        <NumericInput
          className={'number-input'}
          autoComplete={'off'}
          style={false}
          precision={3}
          value={shape.posY}
          onChange={(num: number) => this.setPosY(num)}
        />
      </GuiDrawer>
    );
  }

  private readonly setPosX = (value: number) => {
    const { shape } = this.props;

    // let value = parseFloat(e.target.value);
    // if (Number.isNaN(value)) {
    //   value = 0;
    // }

    const newPos = new THREE.Vector3(value, shape.mesh.position.y, 0);

    eventManager.fire({ e: EventType.REPOSITION_SHAPE, newPos });
  };

  private readonly setPosY = (value: number) => {
    const { shape } = this.props;

    // let value = parseFloat(e.target.value);
    // if (Number.isNaN(value)) {
    //   value = 0;
    // }

    const newPos = new THREE.Vector3(shape.mesh.position.x, value, 0);

    eventManager.fire({ e: EventType.REPOSITION_SHAPE, newPos });
  };
}
