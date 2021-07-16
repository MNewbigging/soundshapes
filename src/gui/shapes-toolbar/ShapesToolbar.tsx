import { observer } from 'mobx-react';
import React from 'react';

import { Shape } from '../../common/types/Shapes';
import { GuiVisibility } from '../GuiState';

import { ShapeButton } from './ShapeButton';

import './shapes-toolbar.scss';

interface Props {
  visibility: GuiVisibility;
}

@observer
export class ShapesToolbar extends React.Component<Props> {
  public render() {
    const { visibility } = this.props;

    return (
      <div className={'shapes-toolbar ' + visibility}>
        <ShapeButton shape={Shape.BEATER} />
      </div>
    );
  }
}
