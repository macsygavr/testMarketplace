import React from "react";
import css from "./index.module.css";
import BackIcon from "../../assets/icons/BackIcon";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  const handleBackButton = () => {
    navigate(-1);
  };

  return (
    <div className={css.backBtnContainer} onClick={handleBackButton}>
      <div className={css.icon}>
        <BackIcon />
      </div>
      <span className={css.backBtnText}>Назад</span>
    </div>
  );
};

export default BackButton;
