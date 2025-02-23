import React, { useEffect, useMemo, useState } from "react";
import css from "./index.module.css";
import PageTittle from "../../components/PageTittle/PageTittle";
import BlockTitle from "./components/BlockTitle/BlockTitle";
import cn from "classnames";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { getProductVariations, ProductVariation } from "../../api/productsApi";
import { ChartItem } from "../../api/helpers";
import { generateOrderNumber } from "./helpers";
import { format } from "date-fns";

export type OrderItem = {
  date: string;
  time: string;
  address: string;
  name: string;
  phone: string;
  totalPrice: number;
  orderId: string;
  orderDate: string;
  products: ChartItem[];
};

const Order = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const [chartValues, setChartValues] = useState<ChartItem[]>();
  const [productsVariations, setProductVariations] =
    useState<ProductVariation[]>();

  useEffect(() => {
    const chartValues = localStorage.getItem("chart");

    if (chartValues) {
      setChartValues(JSON.parse(chartValues));
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (chartValues) {
      const productIds = chartValues.map((item) => item.productId);
      getProductVariations(productIds).then(setProductVariations);
    }
  }, [chartValues]);

  const totalPrice = useMemo(() => {
    if (chartValues && productsVariations) {
      const priceList = chartValues.map(
        (item) =>
          productsVariations.find((el) => el.id === item.variantId)?.price
      );

      return (priceList as number[]).reduce((acc, item) => acc + item, 0);
    }
  }, [chartValues, productsVariations]);

  const handleOrder = () => {
    if (chartValues) {
      const orderId = generateOrderNumber();
      const orderDate = format(new Date(), "dd.MM.yyyy");

      const order: OrderItem = {
        date,
        time,
        name,
        address,
        phone,
        totalPrice: totalPrice ?? 0,
        orderId,
        orderDate,
        products: chartValues,
      };

      localStorage.removeItem("chart");

      if (localStorage.getItem("history")) {
        localStorage.setItem(
          "history",
          JSON.stringify([
            ...[...JSON.parse(localStorage.getItem("history") ?? "")],
            order,
          ])
        );
      } else {
        localStorage.setItem("history", JSON.stringify([order]));
      }

      navigate("/history");
    }
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
              <span
                className={css.orderSummaryItemText}
              >{`${totalPrice?.toLocaleString()}₽`}</span>
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
              <span className={css.orderSummValue}>{`${(
                (totalPrice ?? 0) + 200
              ).toLocaleString()}₽`}</span>
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
