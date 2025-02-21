import React, { FC, PropsWithChildren } from "react";
import css from "./index.module.css";
import SideMenu from "../SideMenu/SideMenu";

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
