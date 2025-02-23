const baseApiPath = "https://test2.sionic.ru/api";

export type ChartItem = {
  productId: number;
  variantId: number;
  count?: number;
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

export const handleAddToChart = ({ productId, variantId }: ChartItem) => {
  const chartItem = {
    productId,
    variantId,
  };

  if (localStorage.getItem("chart")) {
    localStorage.setItem(
      "chart",
      JSON.stringify([
        ...[...JSON.parse(localStorage.getItem("chart") ?? "")],
        chartItem,
      ])
    );
  } else {
    localStorage.setItem("chart", JSON.stringify([chartItem]));
  }
};

export const handleRemoveOnePieceFromChart = ({
  productId,
  variantId,
}: ChartItem) => {
  const chartValues = localStorage.getItem("chart");

  if (chartValues) {
    const parsedValues: ChartItem[] = JSON.parse(chartValues);

    const index = parsedValues.findIndex(
      (item) => item.productId === productId && item.variantId === variantId
    );

    parsedValues.splice(index, 1);

    localStorage.setItem("chart", JSON.stringify(parsedValues));
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
