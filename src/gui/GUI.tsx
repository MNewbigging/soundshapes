import { observer } from 'mobx-react';
import React from 'react';

import { AppState } from '../AppState';
import { Dialog } from './dialogs/Dialog';
import { HelpDialog } from './dialogs/HelpDialog';
import { GameToolbar } from './game-toolbar/GameToolbar';

import { GuiState } from './GuiState';
import { PropsToolbar } from './props-toolbar/PropsToolbar';
import { ShapesToolbar } from './shapes-toolbar/ShapesToolbar';

interface Props {
  appState: AppState;
}

@observer
export class GUI extends React.Component<Props> {
  private readonly guiState = new GuiState();

  public render() {
    const { appState } = this.props;

    return (
      <>
        <ShapesToolbar guiState={this.guiState} />
        <GameToolbar
          guiState={this.guiState}
          onPlay={() => appState.playGame()}
          onStop={() => appState.stopGame()}
        />
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
