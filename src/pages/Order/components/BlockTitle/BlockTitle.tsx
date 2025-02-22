import React, { FC } from "react";
import css from "./index.module.css";

type Props = {
  title: string;
}

const BlockTitle:FC<Props> = ({ title }) => {
  return (
    <span className={css.title}>
      {title}
    </span>
  );
};

export default BlockTitle;
