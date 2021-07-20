import { observer } from 'mobx-react';
import React from 'react';

import { Beater } from '../../common/types/shapes/Beater';
import { Shape, ShapeType } from '../../common/types/shapes/Shape';
import { GuiState } from '../GuiState';
import { DirectionEditor } from './DirectionEditor';
import { PositionEditor } from './PositionEditor';
import { SpeedEditor } from './SpeedEditor';

import './props-toolbar.scss';
import { ScaleEditor } from './ScaleEditor';

interface Props {
  guiState: GuiState;
}

@observer
export class PropsToolbar extends React.Component<Props> {
  public render() {
    const { guiState } = this.props;

    let properties: JSX.Element = <></>;
    if (guiState.selectedShape) {
      properties = this.getShapePropertyEditors(guiState.selectedShape);
    }

    return <div className={'props-toolbar ' + guiState.propsVis}>{properties}</div>;
  }

  private getShapePropertyEditors(shape: Shape) {
    switch (shape.type) {
      case ShapeType.BEATER:
        const beater = shape as Beater;
        return (
          <div>
            <PositionEditor shape={beater} />
            <SpeedEditor beater={beater} />
            <DirectionEditor beater={beater} />
          </div>
        );

      case ShapeType.SQUARE:
        return (
          <div>
            <PositionEditor shape={shape} />
            <ScaleEditor shape={shape} />
          </div>
        );

      default:
        return <></>;
    }
  }
}
