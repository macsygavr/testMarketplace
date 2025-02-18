import React from "react";
import css from "./index.module.css";
import { useNavigate } from "react-router-dom";
import FacebookIcon from "../../assets/icons/FacebookIcon";
import VKIcon from "../../assets/icons/VKIcon";
import Instagram from "../../assets/icons/Instagram";
import GooglePlayIcon from "../../assets/icons/GooglePlayIcon";
import AppStoreIcon from "../../assets/icons/AppStoreIcon";

const Footer = () => {
  const navigate = useNavigate();

  const handleGoToMainPage = () => {
    navigate("/");
  };

  return (
    <div className={css.container}>
      <div className={css.upperBlock}>
        <div className={css.iconText} onClick={handleGoToMainPage}>
          React
        </div>
        <div className={css.actionsBlock}>
          <div className={css.actionsSubblockContainer}>
            <div className={css.actionsSubblockText}>Присоединяйтесь к нам</div>
            <div className={css.socialMediaIcons}>
              <FacebookIcon />
              <VKIcon />
              <Instagram />
            </div>
          </div>
          <div className={css.actionsSubblockContainer}>
            <div className={css.actionsSubblockText}>
              Устанавливайте приложение
            </div>
            <div className={css.appIcons}>
              <GooglePlayIcon />
              <AppStoreIcon />
            </div>
          </div>
        </div>
      </div>
      <div className={css.buttomBlock}>
        <span>© Sionic</span>
        <span className={css.clickable}>Правовая информация</span>
        <span className={css.clickable}>Политика конфиденциальности</span>
      </div>
    </div>
  );
};

export default Footer;
