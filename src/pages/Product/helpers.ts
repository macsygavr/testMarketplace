import { ProductVariationPropertyValue } from "../../api/productsApi";
import { ProductProperties } from "./Product";

export const filterProperties = ({
  properties,
  isUniq,
}: {
  properties: ProductProperties[];
  isUniq: boolean;
}): ProductProperties[] => {
  const arrays = properties.map((item) => item.values);
  const productProperties: ProductProperties[] = [];

  const isVariantsEqual = arrays.every(
    (item) => JSON.stringify(item) === JSON.stringify(arrays[0])
  );

  if(isVariantsEqual) {
    return properties
  }

  const uniqProperties = arrays.reduce((acc, array, index) => {
    return [
      ...acc,
      ...array.filter(
        (item) =>
          !arrays.some(
            (otherArray, otherIndex) =>
              otherIndex !== index && otherArray.includes(item)
          )
      ),
    ];
  }, []);

  properties.forEach((item) => {
    const property = item.values.filter((el) =>
      isUniq ? uniqProperties.includes(el) : !uniqProperties.includes(el)
    );

    productProperties.push({
      productVariationid: item.productVariationid,
      values: property,
    });
  });

  return productProperties;
};

export const isProductVariantsEqual = (
  values: ProductVariationPropertyValue[]
) => {
  const groupedValuesByVariantId = values.reduce((acc, obj) => {
    const key = obj.product_variation_id;

    //@ts-ignore
    if (!acc[key]) {
      //@ts-ignore
      acc[key] = [];
    }

    //@ts-ignore
    acc[key].push({ ...obj });

    return acc;
  }, {});

  const variantsValues = Object.values(groupedValuesByVariantId);

  variantsValues.forEach((item) =>
    //@ts-ignore
    item.forEach((el) => {
      delete el.id;
      delete el.product_variation_id;
    })
  );

  const isVariantsEqual = variantsValues.every(
    (item) => JSON.stringify(item) === JSON.stringify(variantsValues[0])
  );

  return isVariantsEqual;
};
