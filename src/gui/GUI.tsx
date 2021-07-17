import { observer } from 'mobx-react';
import React from 'react';
import { Dialog } from './dialogs/Dialog';
import { HelpDialog } from './dialogs/HelpDialog';
import { GameToolbar } from './game-toolbar/GameToolbar';

import { GuiState } from './GuiState';
import { PropsToolbar } from './props-toolbar/PropsToolbar';
import { ShapesToolbar } from './shapes-toolbar/ShapesToolbar';

@observer
export class GUI extends React.Component {
  private readonly guiState = new GuiState();

  public render() {
    return (
      <>
        <ShapesToolbar guiState={this.guiState} />
        <GameToolbar guiState={this.guiState} />
        <PropsToolbar guiState={this.guiState} />

        <Dialog
          open={this.guiState.helpDialogOpen}
          title={'Help'}
          body={<HelpDialog />}
          onClose={() => this.guiState.closeHelp()}
        />
      </>
    );
  }
}
