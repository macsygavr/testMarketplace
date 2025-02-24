import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChartItem } from "../types";
import {
  handleAddToChart,
  handleRemoveAllPiecesFromChart,
  handleRemoveOnePieceFromChart,
} from "../../api/helpers";

const getInitialChartState = () => {
  const chart = localStorage.getItem("chart");

  if (chart) return JSON.parse(chart);

  return [];
};

const getInitialTotalPriceState = () => {
  const chart = localStorage.getItem("chart");

  if (chart) {
    const parsedChart: ChartItem[] = JSON.parse(chart);

    return parsedChart.reduce(
      (acc, item) => (acc ?? 0) + (item.priceForItem ?? 0) * (item.count ?? 0),
      0
    );
  }

  return 0;
};

interface ChartState {
  chart: ChartItem[];
  totalPrice: number;
}

const initialState: ChartState = {
  chart: getInitialChartState(),
  totalPrice: getInitialTotalPriceState(),
};

const chartSlice = createSlice({
  name: "chart",
  initialState,
  reducers: {
    addToChart: (state, payload: PayloadAction<ChartItem>) => {
      handleAddToChart(payload.payload);

      const chart = localStorage.getItem("chart");

      if (chart) state.chart = JSON.parse(chart);
      state.totalPrice = state.totalPrice + payload.payload.priceForItem;
    },
    removeOneProductItemFromChart: (
      state,
      payload: PayloadAction<ChartItem>
    ) => {
      handleRemoveOnePieceFromChart(payload.payload);

      const chart = localStorage.getItem("chart");

      if (chart) state.chart = JSON.parse(chart);
      state.totalPrice = state.totalPrice - payload.payload.priceForItem;
    },
    removeAllProductItemsFromChart: (
      state,
      payload: PayloadAction<ChartItem>
    ) => {
      handleRemoveAllPiecesFromChart(payload.payload);

      const chart = localStorage.getItem("chart");

      if (chart) state.chart = JSON.parse(chart);
      state.totalPrice =
        state.totalPrice -
        payload.payload.priceForItem * (payload.payload.count ?? 0);
    },
    resetChart: (state) => {
      localStorage.removeItem("chart");
      state.chart = [];
      state.totalPrice = 0;
    },
  },
});

export const {
  addToChart,
  removeOneProductItemFromChart,
  removeAllProductItemsFromChart,
  resetChart,
} = chartSlice.actions;
export default chartSlice.reducer;
