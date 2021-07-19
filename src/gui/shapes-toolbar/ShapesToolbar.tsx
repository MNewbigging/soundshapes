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
        {this.renderSquareButton()}
      </div>
    );
  }

  private renderBeaterButton() {
    const { guiState } = this.props;

    return (
      <GuiButton onClick={() => guiState.addShape(ShapeType.BEATER)}>
        <div className={'icon beater'}></div>
      </GuiButton>
    );
  }

  private renderSquareButton() {
    const { guiState } = this.props;

    return (
      <GuiButton onClick={() => guiState.addShape(ShapeType.SQUARE)}>
        <div className={'icon square'}></div>
      </GuiButton>
    );
  }
}
