import React, { useEffect, useState } from "react";
import css from "./index.module.css";
import { OrderItem } from "../Order/Order";
import HistoryItem from "./components/HistoryItem/HistoryItem";
import PageTittle from "../../components/PageTittle/PageTittle";
import { useNavigate } from "react-router-dom";

const History = () => {
  const navigate = useNavigate();
  const [historyList, setHistoryList] = useState<OrderItem[]>();

  const handleGoToDetails = (id: string) => {
    navigate(`/history-order/${id}`);
  };

  useEffect(() => {
    const orderValues = localStorage.getItem("history");

    if (orderValues) {
      const parsedValues: OrderItem[] = JSON.parse(orderValues);

      setHistoryList(parsedValues);
    }
  }, []);

  return (
    <>
      <PageTittle title="История заказов" />
      <div className={css.orderListContainer}>
        {historyList?.map((item) => (
          <HistoryItem
            key={item.orderId}
            orderId={item.orderId}
            orderDate={item.orderDate}
            totalPrice={item.totalPrice}
            products={item.products}
            address={item.address}
            onClick={handleGoToDetails}
          />
        ))}
      </div>
    </>
  );
};

export default History;
