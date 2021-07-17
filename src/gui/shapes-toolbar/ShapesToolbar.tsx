import { observer } from 'mobx-react';
import React from 'react';

import { ShapeType } from '../../common/types/Shapes';
import { GuiState } from '../GuiState';

import { ShapeButton } from './ShapeButton';

import './shapes-toolbar.scss';

interface Props {
  guiState: GuiState;
}

@observer
export class ShapesToolbar extends React.Component<Props> {
  public render() {
    const { guiState } = this.props;

    return (
      <div className={'shapes-toolbar ' + guiState.guiVis}>
        <ShapeButton shape={ShapeType.BEATER} onClick={() => guiState.addShape(ShapeType.BEATER)} />
      </div>
    );
  }
}
