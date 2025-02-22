import React, { FC } from "react";
import css from "./index.module.css";

type Props = {
  title: string;
};

const PageTittle: FC<Props> = ({ title }) => {
  return <div className={css.title}>{title}</div>;
};

export default PageTittle;
