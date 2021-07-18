import React from 'react';

import { ShapeType } from '../../common/types/Shapes';

import './shape-button.scss';

interface Props {
  shape: ShapeType;
}

export class ShapeButton extends React.Component<Props> {
  public render() {
    const shapeIcon = this.getShapeIcon();

    return <>{shapeIcon}</>;
  }

  private getShapeIcon() {
    const { shape } = this.props;

    switch (shape) {
      case ShapeType.BEATER:
        return <BeaterIcon />;

      default:
        return <></>;
    }
  }
}

const BeaterIcon: React.FC = () => {
  return <div className={'icon beater'}></div>;
};
