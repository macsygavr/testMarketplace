import React, { useState } from "react";
import css from "./index.module.css";
import PageTittle from "../../components/PageTittle/PageTittle";
import BlockTitle from "./components/BlockTitle/BlockTitle";
import cn from "classnames";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const handleOrder = () => {
    navigate("/history");
  };

  const disabled = !(date && time && address && name && phone);

  return (
    <>
      <PageTittle title="Доставка" />
      <div className={css.container}>
        <div className={css.allBlocksContainer}>
          <div className={css.blockContainer}>
            <BlockTitle title="Когда доставить?" />
            <div className={css.dateContainer}>
              <div className={css.dateInputContainer}>
                <label className={css.dateLable} htmlFor="date">
                  Выберите дату
                </label>
                <input
                  className={css.dateInput}
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className={css.dateInputContainer}>
                <label className={css.dateLable} htmlFor="time">
                  Выберите время
                </label>
                <input
                  className={css.dateInput}
                  type="time"
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className={css.blockContainer}>
            <BlockTitle title="Куда доставить?" />
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={css.textInput}
              type="text"
              placeholder="Выберите адрес доставки"
            />
          </div>
          <div className={css.blockContainer}>
            <BlockTitle title="Имя" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={css.textInput}
              type="text"
            />
          </div>
          <div className={css.blockContainer}>
            <BlockTitle title="Телефон" />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={css.textInput}
              type="text"
            />
          </div>
        </div>
        <div className={css.orderSummaryContainer}>
          <div className={css.orderSummaryInfo}>
            <div className={css.orderSummaryItemContainer}>
              <span className={css.orderSummaryItemText}>
                Стоимость товаров:
              </span>
              <span className={css.orderSummaryItemText}>200 584₽</span>
            </div>
            <div className={css.orderSummaryItemContainer}>
              <span className={css.orderSummaryItemText}>
                Стоимость доставки:
              </span>
              <span className={css.orderSummaryItemText}>200₽</span>
            </div>
            <div className={css.orderSummContainer}>
              <span className={cn(css.orderSummaryItemText, css.orderSumm)}>
                Итого:
              </span>
              <span className={css.orderSummValue}>200 784₽</span>
            </div>
          </div>
          <Button disabled={disabled} onClick={handleOrder}>
            Сделать заказ
          </Button>
        </div>
      </div>
    </>
  );
};

export default Order;
