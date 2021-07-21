import React from 'react';

interface ButtonProps {
  onClick: (e: React.MouseEvent) => void;
}

export const GuiButton: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <div className={'ui-button'} onClick={(e: React.MouseEvent) => onClick(e)}>
      {children}
    </div>
  );
};
