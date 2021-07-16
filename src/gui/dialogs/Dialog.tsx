import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

import './dialog.scss';

interface Props {
  open: boolean;
  title: string;
  body: JSX.Element;
  onClose: () => void;
}

@observer
export class Dialog extends React.Component<Props> {
  @observable private className = '';

  public render() {
    const { open, title, body } = this.props;

    return (
      <dialog className={'dialog ' + this.className} open={open} onAnimationEnd={this.onAnimEnd}>
        <div className={'container'}>
          <div className={'header'}>
            <div>{title}</div>
            <button onClick={() => this.startClosing()}>Close</button>
          </div>
          <div className={'body'}>{body}</div>
        </div>
      </dialog>
    );
  }

  @action private startClosing() {
    // Start the closing animation
    this.className = 'closing';
  }

  @action private readonly onAnimEnd = (e: React.AnimationEvent<HTMLDialogElement>) => {
    const { onClose } = this.props;

    // If dialog has just finished closing
    if (e.animationName === 'closeDialog') {
      this.className = '';
      onClose();
    }
  };
}
