import { observer } from 'mobx-react';
import React from 'react';

import { AppState } from './AppState';

import './app.scss';

@observer
export class App extends React.PureComponent {
  private readonly appState = new AppState();

  public render() {
    return <></>;
  }
}
