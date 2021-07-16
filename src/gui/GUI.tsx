import React from 'react';

import { GuiState } from './GuiState';
import { ShapesToolbar } from './shapes-toolbar/ShapesToolbar';

export class GUI extends React.Component {
  private readonly guiState = new GuiState();

  public render() {
    return (
      <>
        <ShapesToolbar />
      </>
    );
  }
}
