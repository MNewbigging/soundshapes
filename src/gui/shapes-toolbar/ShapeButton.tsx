import React from 'react';

import { Shape } from '../../common/types/Shapes';

import './shape-button.scss';

interface Props {
  shape: Shape;
  onClick: () => void;
}

export class ShapeButton extends React.Component<Props> {
  public render() {
    const { onClick } = this.props;

    const shapeIcon = this.getShapeIcon();

    return (
      <div className={'shape-button'} onClick={() => onClick()}>
        {shapeIcon}
      </div>
    );
  }

  private getShapeIcon() {
    const { shape } = this.props;

    switch (shape) {
      case Shape.BEATER:
        return <BeaterIcon />;

      default:
        return <></>;
    }
  }
}

const BeaterIcon: React.FC = () => {
  return <div className={'icon beater'}></div>;
};
