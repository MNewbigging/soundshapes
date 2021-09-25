import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

import { eventManager, EventType } from '../../common/EventManager';

interface Props {
  buttonText: string;
  className?: string;
}

@observer
export class GuiDrawer extends React.Component<Props> {
  @observable drawerOpen = false;

  componentDidMount() {
    eventManager.registerEventListener(EventType.DESELECT_SHAPE, this.onCloseDrawer);
    eventManager.registerEventListener(EventType.DELETE_SHAPE, this.onCloseDrawer);
  }

  public render() {
    const { className, buttonText } = this.props;

    const drawerClass = this.drawerOpen ? 'open' : 'closed';

    return (
      <div className={'drawer-parent ' + className}>
        <div className={'ui-button'} onClick={this.onClickDrawerButton}>
          {buttonText}
        </div>
        <div className={'drawer ' + drawerClass}>{this.props.children}</div>
      </div>
    );
  }

  @action private readonly onClickDrawerButton = () => {
    this.drawerOpen = !this.drawerOpen;
  };

  @action private readonly onCloseDrawer = () => {
    this.drawerOpen = false;
  };
}
