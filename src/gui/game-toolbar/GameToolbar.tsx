import { observer } from 'mobx-react';
import React from 'react';

import { GuiButton } from '../../common/components/GuiButton';
import { GuiState } from '../GuiState';

import './game-toolbar.scss';

interface Props {
  guiState: GuiState;
  onPlay: () => void;
  onStop: () => void;
}

@observer
export class GameToolbar extends React.Component<Props> {
  public render() {
    const { guiState } = this.props;

    return (
      <div className={'game-toolbar ' + guiState.gameVis}>
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
    const { onPlay } = this.props;

    return (
      <GuiButton onClick={() => onPlay()}>
        <div>Play</div>
      </GuiButton>
    );
  }

  private renderStopButton() {
    const { onStop } = this.props;

    return (
      <GuiButton onClick={() => onStop()}>
        <div>Stop</div>
      </GuiButton>
    );
  }
}
