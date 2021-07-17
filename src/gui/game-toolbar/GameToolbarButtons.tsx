import React from 'react';

import './game-button.scss';

interface ButtonProps {
  onClick: () => void;
}

export const HelpButton: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <div className={'ui-button help'} onClick={() => onClick()}>
      <div>?</div>
    </div>
  );
};
