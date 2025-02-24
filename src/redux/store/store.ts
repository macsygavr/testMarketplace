import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "../reducers/categories";
import productsReducer from "../reducers/products";
import chartReducer from "../reducers/chart";

const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    products: productsReducer,
    chart: chartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
