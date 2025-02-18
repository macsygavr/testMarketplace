import React, { FC, ReactNode } from "react";
import css from "./index.module.css";

type Props = {
  banner: ReactNode;
  buttonText: string;
  onClick: () => void;
};

const BannerWrapper: FC<Props> = ({ banner, buttonText, onClick }) => {
  return (
    <div className={css.container}>
      {banner}
      <div className={css.buttonContainer}>
        <button className={css.button} onClick={onClick}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default BannerWrapper;
