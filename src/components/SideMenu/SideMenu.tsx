import React from "react";
import css from "./index.module.css";
import Banner from "../../assets/Banner";
import BannerWrapper from "./components/BannerWrapper/BannerWrapper";

/** Боковое меню для баннеров */
const SideMenu = () => {
  return (
    <div className={css.container}>
      <BannerWrapper
        banner={<Banner />}
        buttonText={"Узнать подробнее"}
        onClick={() => console.log("Узнать подробнее - clicked")}
      />
    </div>
  );
};

export default SideMenu;
