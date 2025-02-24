import React, { useEffect, useMemo, useRef, useState } from "react";
import css from "./index.module.css";
import CategoryCard from "./components/CategoryCard/CategoryCard";
import { Category, getCategories } from "../../api/categoriesApi";
import {
  getAllProducts,
  getProductImages,
  getProductVariations,
  Product,
  ProductImage,
  ProductVariation,
} from "../../api/productsApi";
import ProductCard from "./components/ProductCard/ProductCard";
import { getRandomDarkColor } from "./components/CategoryCard/helpers";
import PageTittle from "../../components/PageTittle/PageTittle";

/** Cтраница с карточками всех товаров и категориями */
const Main = () => {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // стейты товаров и категорий
  const [categories, setCategories] = useState<Category[]>();
  const [selectedCategory, setSelectedCategory] = useState<number>();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsImages, setProductsImages] = useState<ProductImage[]>([]);
  const [productsVariations, setProductsVariations] = useState<
    ProductVariation[]
  >([]);

  // стейты для infinity scroll
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [startRange, setStartRange] = useState<number>(0);

  // Сразу загружаем все имеющиеся категории
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  // подгружаем новую порцию товаров при изменении категории или "страницы"
  useEffect(() => {
    loadMoreProducts();
    // eslint-disable-next-line
  }, [startRange, selectedCategory]);

  // слушатель скролла
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setStartRange((prevStartRange) => prevStartRange + 16);
        }
      },
      {
        rootMargin: "100px",
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        // eslint-disable-next-line
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading, hasMore]);

  // подгружаем изображения и варианты товаров для новой порции товаров
  useEffect(() => {
    if (products.length) {
      // выбираем айдишники только для новой порции, поскольку эндпоинт 
      // не может вернуть так много элементов изображений и вариантов
      const productsIds = products
        ?.slice(startRange, startRange + 16)
        .map((item) => item.id);
      
      if (productsIds.length) {
        // загружаем изображения товаров
        getProductImages(productsIds).then((data) =>
          setProductsImages((prev) => [...prev, ...data])
        );
        // загружаем варианты товаров
        getProductVariations(productsIds).then((data) =>
          setProductsVariations((prev) => [...prev, ...data])
        );
      }
    }
  }, [products, startRange]);

  // генерируем рандомные цвета для отображения категорий
  const colors = useMemo(
    () => (categories ?? []).map(() => getRandomDarkColor()),
    [categories]
  );

  /** Функция подгрузки товаров */
  const loadMoreProducts = () => {
    if (loading || !hasMore) return;

    setLoading(true);
    getAllProducts(startRange, selectedCategory)
      .then((data) => {
        if (data.length === 0) {
          setHasMore(false);
        } else {
          setProducts((prevData) => [...prevData, ...data]);
        }
      })
      .finally(() => setLoading(false));
  };

  // при изменении категории очищаем список товаров, открываем возможность для загрузки с нуля
  const handleOnCategoryClick = (categoryId: number) => {
    setProducts([]);
    setStartRange(0);
    setHasMore(true);
    setSelectedCategory(categoryId);
  };

  return (
    <>
      <div className={css.categoriesBlock}>
        <PageTittle title="Категории товаров" />
        <div className={css.categoriesList}>
          {categories?.map((item, index) => (
            <CategoryCard
              key={item.id}
              categoryName={item.name}
              color={colors[index]}
              onClick={() => handleOnCategoryClick(item.id)}
            />
          ))}
        </div>
      </div>
      <div className={css.productsList}>
        {!((products ?? []).length > 0) && (
          <span className={css.noProductsMessage}>
            В этой категории пока товаров нет
          </span>
        )}
        {productsImages &&
          productsVariations &&
          products?.map((item) => {
            const images = productsImages.filter(
              (el) => el.product_id === item.id
            );
            const variations = productsVariations.filter(
              (el) => el.product_id === item.id
            );

            return (
              <ProductCard
                key={item.id}
                productId={item.id}
                productName={item.name}
                productImages={images}
                productVariations={variations}
              />
            );
          })}
      </div>
      <div ref={loaderRef} />
    </>
  );
};

export default Main;
