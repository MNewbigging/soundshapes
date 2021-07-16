import React from 'react';

import './help-dialog.scss';

export class HelpDialog extends React.Component {
  public render() {
    return (
      <div className={'help-dialog'}>
        <div>Hot Keys:</div>
        <ul>
          <li>T: Toggle GUI visibility</li>
          <li>Escape: Cancel action (e.g cancel add shape action)</li>
        </ul>
      </div>
    );
  }
}
