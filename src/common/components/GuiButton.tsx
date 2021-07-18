import React from 'react';

interface ButtonProps {
  onClick: () => void;
}

export const GuiButton: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <div className={'ui-button'} onClick={() => onClick()}>
      {children}
    </div>
  );
};
