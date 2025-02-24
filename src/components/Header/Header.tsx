import React, { useMemo, useState } from "react";
import css from "./index.module.css";
import ChartIcon from "../../assets/icons/ChartIcon";
import SearchIcon from "../../assets/icons/SearchIcon";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { RootState } from "../../redux/store/store";
import { useSelector } from "react-redux";

const Header = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const { chart } = useSelector((state: RootState) => state.chart);

  const count = useMemo(
    () =>
      chart
        .map((item) => item.count)
        .reduce((acc, item) => (acc ?? 0) + (item ?? 0), 0),
    [chart]
  );

  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleGoToChart = () => {
    navigate("/chart");
  };

  const handleGoToMainPage = () => {
    navigate("/");
  };

  const handleGoToOrderPage = () => {
    navigate("/history");
  };

  return (
    <div className={css.container}>
      <div className={css.responsiveContainer}>
        <div className={css.responsiveSubContainer}>
          <div className={css.iconText} onClick={handleGoToMainPage}>
            React
          </div>
          <div
            className={css.historyBtnContainer}
            onClick={handleGoToOrderPage}
          >
            История заказов
          </div>
        </div>
        {isMobile && (
          <div className={css.profileContainer}>
            <div className={css.chartContainer} onClick={handleGoToChart}>
              <div className={css.chartIcon}>
                <ChartIcon />
              </div>
              <div className={css.chartCounter}>{count}</div>
            </div>
            <div className={css.imgContainer}>
              <img className={css.mainImg} src={"/avatar.png"} alt={""} />
            </div>
          </div>
        )}
      </div>
      <div className={css.searchInputContainer}>
        <input
          className={css.searchInput}
          placeholder={"Поиск бренда, товара, категории..."}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div className={css.searchBtnContainer}>
          <button className={css.searchBtn}>
            <SearchIcon />
          </button>
        </div>
      </div>
      {!isMobile && (
        <div className={css.profileContainer}>
          <div className={css.chartContainer} onClick={handleGoToChart}>
            <div className={css.chartIcon}>
              <ChartIcon />
            </div>
            <div className={css.chartCounter}>{count}</div>
          </div>
          <div className={css.imgContainer}>
            <img className={css.mainImg} src={"/avatar.png"} alt={""} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
