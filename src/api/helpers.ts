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

export const handleAddToChart = ({
  productId,
  variantId,
}: {
  productId: number;
  variantId: number;
}) => {
  const preparedItem = JSON.stringify({
    productId,
    variantId
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
