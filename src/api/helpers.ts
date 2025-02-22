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
  const preparedItem = JSON.stringify({
    productId,
    variantId,
  });

  if (localStorage.getItem("chart")) {
    localStorage.setItem(
      "chart",
      JSON.stringify([
        ...[...JSON.parse(localStorage.getItem("chart") ?? "")],
        preparedItem,
      ])
    );
  } else {
    localStorage.setItem("chart", JSON.stringify([preparedItem]));
  }
};

export const handleRemoveOnePieceFromChart = ({
  productId,
  variantId,
}: ChartItem) => {
  const chartValues = localStorage.getItem("chart");

  if (chartValues) {
    const parsedValues: ChartItem[] = JSON.parse(chartValues).map(
      (item: string) => JSON.parse(item)
    );

    const index = parsedValues.findIndex(
      (item) => item.productId === productId && item.variantId === variantId
    );

    parsedValues.splice(index, 1);

    const preparedValues = JSON.stringify(
      parsedValues.map((item) => JSON.stringify(item))
    );

    localStorage.setItem("chart", preparedValues);
  }
};

export const handleRemoveAllPiecesFromChart = ({
  productId,
  variantId,
}: ChartItem) => {
  const chartValues = localStorage.getItem("chart");

  if (chartValues) {
    const parsedValues: ChartItem[] = JSON.parse(chartValues).map(
      (item: string) => JSON.parse(item)
    );

    const filteredValues = parsedValues.filter(
      (item) => !(item.productId === productId && item.variantId === variantId)
    );

    const preparedValues = JSON.stringify(
      filteredValues.map((item) => JSON.stringify(item))
    );

    localStorage.setItem("chart", preparedValues);
  }
};
