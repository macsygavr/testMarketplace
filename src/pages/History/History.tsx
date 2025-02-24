import React, { useEffect, useState } from "react";
import css from "./index.module.css";
import { OrderItem } from "../Order/Order";
import HistoryItem from "./components/HistoryItem/HistoryItem";
import PageTittle from "../../components/PageTittle/PageTittle";
import { useNavigate } from "react-router-dom";

/** Страница истории заказов */
const History = () => {
  const navigate = useNavigate();
  const [historyList, setHistoryList] = useState<OrderItem[]>();

  const handleGoToDetails = (id: string) => {
    navigate(`/history-order/${id}`);
  };

  // получаем оформленные в прошлом заказы из local storage
  useEffect(() => {
    const orderValues = localStorage.getItem("history");

    if (orderValues) {
      const parsedValues: OrderItem[] = JSON.parse(orderValues);

      setHistoryList(parsedValues);
    }
  }, []);

  // получаем суммарное количество всех товаров в заказе
  const getProductsCount = (orderItem: OrderItem) => {
    return orderItem.products
      ?.map((item) => item.count)
      .reduce((acc, item) => (acc ?? 0) + (item ?? 0), 0);
  };

  return (
    <>
      <PageTittle title="История заказов" />
      <div className={css.orderListContainer}>
        {!historyList?.length && "Здесь пока пусто"}
        {historyList?.map((item) => (
          <HistoryItem
            key={item.orderId}
            orderId={item.orderId}
            orderDate={item.orderDate}
            totalPrice={item.totalPrice}
            productsCount={getProductsCount(item) ?? 0}
            address={item.address}
            onClick={handleGoToDetails}
          />
        ))}
      </div>
    </>
  );
};

export default History;
