import { observer } from 'mobx-react';
import React from 'react';

import { GuiState } from './GuiState';
import { ShapesToolbar } from './shapes-toolbar/ShapesToolbar';

@observer
export class GUI extends React.Component {
  private readonly guiState = new GuiState();

  public render() {
    return (
      <>
        <ShapesToolbar guiState={this.guiState} />
      </>
    );
  }
}
