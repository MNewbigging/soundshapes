import { observer } from 'mobx-react';
import React from 'react';

import { Beater, Shape, ShapeType } from '../../common/types/Shapes';
import { GuiState } from '../GuiState';
import { PositionEditor } from './PositionEditor';
import { SpeedEditor } from './SpeedEditor';

import './props-toolbar.scss';

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
          <>
            <PositionEditor shape={beater} />
            <SpeedEditor beater={beater} />
          </>
        );

      default:
        return <></>;
    }
  }
}
