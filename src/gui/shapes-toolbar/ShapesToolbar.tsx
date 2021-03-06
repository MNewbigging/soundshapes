import { observer } from 'mobx-react';
import React from 'react';
import { GuiButton } from '../../common/components/GuiButton';

import { ShapeType } from '../../common/types/shapes/Shape';
import { GuiState } from '../GuiState';

import './shapes-toolbar.scss';

interface Props {
  guiState: GuiState;
}

@observer
export class ShapesToolbar extends React.Component<Props> {
  public render() {
    const { guiState } = this.props;

    return (
      <div className={'shapes-toolbar ' + guiState.shapesVis}>
        {this.renderBeaterButton()}
        {this.renderCircleButton()}
        {this.renderTriangleButton()}
        {this.renderSquareButton()}
      </div>
    );
  }

  private renderBeaterButton() {
    const { guiState } = this.props;

    return (
      <GuiButton onClick={(e: React.MouseEvent) => guiState.addShape(ShapeType.BEATER, e)}>
        <div className={'icon beater'}></div>
      </GuiButton>
    );
  }

  private renderCircleButton() {
    const { guiState } = this.props;

    return (
      <GuiButton onClick={(e: React.MouseEvent) => guiState.addShape(ShapeType.CIRCLE, e)}>
        <div className={'icon circle'}></div>
      </GuiButton>
    );
  }

  private renderTriangleButton() {
    const { guiState } = this.props;

    return (
      <GuiButton onClick={(e: React.MouseEvent) => guiState.addShape(ShapeType.TRIANGLE, e)}>
        <div className={'icon triangle'}>
          <svg id={'triangle'} viewBox={'0 0 100 100'}>
            <polygon points={'50 15, 97 97, 3 97'} />
          </svg>
        </div>
      </GuiButton>
    );
  }

  private renderSquareButton() {
    const { guiState } = this.props;

    return (
      <GuiButton onClick={(e: React.MouseEvent) => guiState.addShape(ShapeType.SQUARE, e)}>
        <div className={'icon square'}></div>
      </GuiButton>
    );
  }
}
