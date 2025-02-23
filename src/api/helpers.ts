const baseApiPath = "https://test2.sionic.ru/api";

export type ChartItem = {
  productId: number;
  variantId: number;
  count?: number;
  uniqProperties?: string[];
};

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

export const handleAddToChart = ({ productId, variantId, uniqProperties }: ChartItem) => {
  const chart = localStorage.getItem("chart");

  if (chart) {
    const parsedChart: ChartItem[] = JSON.parse(chart);

    let index = parsedChart.findIndex(
      (item) => item.productId === productId && item.variantId === variantId
    );

    if (parsedChart[index]) {
      parsedChart[index] = {
        ...parsedChart[index],
        count: (parsedChart[index].count ?? 0) + 1,
      };
      localStorage.setItem("chart", JSON.stringify([...parsedChart]));
    } else {
      localStorage.setItem(
        "chart",
        JSON.stringify([
          ...parsedChart,
          {
            productId,
            variantId,
            uniqProperties,
            count: 1,
          },
        ])
      );
    }
  } else {
    localStorage.setItem(
      "chart",
      JSON.stringify([
        {
          productId,
          variantId,
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

    parsedValues[index] = {
      ...parsedValues[index],
      count: (parsedValues[index].count ?? 0) - 1,
    };

    if (parsedValues[index].count === 0) {
      handleRemoveAllPiecesFromChart(parsedValues[index]);
    }

    localStorage.setItem("chart", JSON.stringify(parsedValues));
  }
};
