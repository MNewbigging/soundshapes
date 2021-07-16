import React from 'react';
import { ShapeButton } from './ShapeButton';

import './shapes-toolbar.scss';

export class ShapesToolbar extends React.Component {
  public render() {
    return (
      <div className={'shapes-toolbar'}>
        <ShapeButton />
      </div>
    );
  }
}
