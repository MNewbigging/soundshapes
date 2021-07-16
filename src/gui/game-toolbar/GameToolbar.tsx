import { observer } from 'mobx-react';
import React from 'react';

import { GuiState } from '../GuiState';
import { HelpButton } from './GameToolbarButtons';

import './game-toolbar.scss';

interface Props {
  guiState: GuiState;
}

@observer
export class GameToolbar extends React.Component<Props> {
  public render() {
    const { guiState } = this.props;

    return (
      <div className={'game-toolbar ' + guiState.guiVis}>
        <HelpButton onClick={() => guiState.showHelp()} />
      </div>
    );
  }
}
