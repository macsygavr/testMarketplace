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
