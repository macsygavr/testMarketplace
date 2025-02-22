import React, { FC, ReactNode } from "react";
import css from "./index.module.css";
import cn from "classnames";

type Props = {
  children?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

const Button: FC<Props> = ({ onClick, disabled, children }) => {
  return (
    <button
      className={cn(css.btn, disabled && css.disabled)}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
