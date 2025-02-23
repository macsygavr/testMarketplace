import React, { useEffect, useState } from "react";
import css from "./index.module.css";
import PageTittle from "../../components/PageTittle/PageTittle";
import { useParams } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";
import { ChartItem } from "../../api/helpers";
import { OrderItem } from "../Order/Order";

const HistoryOrder = () => {
  const { id: orderId } = useParams();
  const [productList, setProductList] = useState<ChartItem[]>();

  useEffect(() => {
    if (orderId) {
      const orderValues = localStorage.getItem("history");

      if (orderValues) {
        const parsedValues: OrderItem[] = JSON.parse(orderValues);
        const currentOrder = parsedValues.find(
          (item) => item.orderId === orderId
        );

        setProductList(currentOrder?.products);
      }
    }
  }, [orderId]);

  return (
    <>
      <BackButton />
      <div className={css.pageTitleContainer}>
        <PageTittle title={`Заказ №${orderId}`} />
      </div>
      <PageTittle title={"Товары"} />
      <div className={css.listContainer}></div>
    </>
  );
};

export default HistoryOrder;
