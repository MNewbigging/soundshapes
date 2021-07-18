import { observer } from 'mobx-react';
import React from 'react';

import { GuiButton } from '../../common/components/GuiButton';
import { GuiState } from '../GuiState';

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
        {this.renderPlayButton()}
        {this.renderStopButton()}
        {this.renderHelpButton()}
      </div>
    );
  }

  private renderHelpButton() {
    const { guiState } = this.props;

    return (
      <GuiButton onClick={() => guiState.showHelp()}>
        <div className={'help'}>?</div>
      </GuiButton>
    );
  }

  private renderPlayButton() {
    return (
      <GuiButton onClick={() => console.log('play')}>
        <div>Play</div>
      </GuiButton>
    );
  }

  private renderStopButton() {
    return (
      <GuiButton onClick={() => console.log('stop')}>
        <div>Stop</div>
      </GuiButton>
    );
  }
}
