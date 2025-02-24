import { ChartItem } from "../redux/types";

const baseApiPath = "https://test2.sionic.ru/api";

export const fetchApiWrapper = ({
  path,
  params,
}: {
  path: string;
  params?: string;
}) => {
  return fetch(`${baseApiPath}${path}${params ? `?${params}` : ""}`)
    .then((response) => response.json())
    .catch((err) => {
      console.log(err);
    });
};

export const handleAddToChart = ({ productId, variantId, priceForItem, uniqProperties }: ChartItem) => {
  const chart = localStorage.getItem("chart");

  if (chart) {
    const parsedChart: ChartItem[] = JSON.parse(chart);

    let index = parsedChart.findIndex(
      (item) => item.productId === productId && item.variantId === variantId
    );

    // если корзина есть и товар уже есть в корзине, увеличиваем каунтер на 1
    if (parsedChart[index]) {
      parsedChart[index] = {
        ...parsedChart[index],
        count: (parsedChart[index].count ?? 0) + 1,
      };
      localStorage.setItem("chart", JSON.stringify([...parsedChart]));
    } else {
      // если если корзина есть, но переданного товара нет - добавляем
      localStorage.setItem(
        "chart",
        JSON.stringify([
          ...parsedChart,
          {
            productId,
            variantId,
            priceForItem,
            uniqProperties,
            count: 1,
          },
        ])
      );
    }
  } else {
    // если корзины нет, то создаем и добавляем первый товар
    localStorage.setItem(
      "chart",
      JSON.stringify([
        {
          productId,
          variantId,
          priceForItem,
          uniqProperties,
          count: 1,
        },
      ])
    );
  }
};

export const handleRemoveAllPiecesFromChart = ({
  productId,
  variantId,
}: ChartItem) => {
  const chartValues = localStorage.getItem("chart");

  if (chartValues) {
    const parsedValues: ChartItem[] = JSON.parse(chartValues);

    // очищаем корзину от переданного товара
    const filteredValues = parsedValues.filter(
      (item) => !(item.productId === productId && item.variantId === variantId)
    );

    localStorage.setItem("chart", JSON.stringify(filteredValues));
  }
};

export const handleRemoveOnePieceFromChart = ({
  productId,
  variantId,
}: ChartItem) => {
  const chartValues = localStorage.getItem("chart");

  if (chartValues) {
    const parsedValues: ChartItem[] = JSON.parse(chartValues);

    let index = parsedValues.findIndex(
      (item) => item.productId === productId && item.variantId === variantId
    );

    // уменьшаем каунтер на 1
    parsedValues[index] = {
      ...parsedValues[index],
      count: (parsedValues[index].count ?? 0) - 1,
    };

    localStorage.setItem("chart", JSON.stringify(parsedValues));
  }
};
