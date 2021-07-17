import { observer } from 'mobx-react';
import React from 'react';

import { GuiState } from '../GuiState';

import './props-toolbar.scss';

interface Props {
  guiState: GuiState;
}

@observer
export class PropsToolbar extends React.Component<Props> {
  public render() {
    const { guiState } = this.props;

    return <div className={'props-toolbar ' + guiState.propsVis}></div>;
  }
}
