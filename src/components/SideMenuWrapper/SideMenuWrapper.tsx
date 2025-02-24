import React, { FC, PropsWithChildren } from "react";
import css from "./index.module.css";
import SideMenu from "../SideMenu/SideMenu";

/** Обертка для хедера и тела страницы для отображения бокового меню с баннерами */
const SideMenuWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={css.container}>
      <div className={css.leftBlock}>{children}</div>
      <div className={css.rightBlock}>
        <SideMenu />
      </div>
    </div>
  );
};

export default SideMenuWrapper;
