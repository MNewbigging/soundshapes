import { observer } from 'mobx-react';
import React from 'react';
import * as THREE from 'three';

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
        <input className={'input'} type={'number'} value={shape.posX} onChange={this.setPosX} />

        <div className={'label'}>Y:</div>
        <input className={'input'} type={'number'} value={shape.posY} onChange={this.setPosY} />
      </GuiDrawer>
    );
  }

  private readonly setPosX = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { shape } = this.props;

    const value = parseFloat(e.target.value);
    if (Number.isNaN(value)) {
      return;
    }

    const newPos = new THREE.Vector3(value, shape.mesh.position.y, 0);

    eventManager.fire({ e: EventType.REPOSITION_SHAPE, newPos });
  };

  private readonly setPosY = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { shape } = this.props;

    const value = parseFloat(e.target.value);
    if (Number.isNaN(value)) {
      return;
    }

    const newPos = new THREE.Vector3(shape.mesh.position.x, value, 0);

    eventManager.fire({ e: EventType.REPOSITION_SHAPE, newPos });
  };
}
