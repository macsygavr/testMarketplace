import React, { useEffect, useMemo, useRef, useState } from "react";
import css from "./index.module.css";
import CategoryCard from "./components/CategoryCard/CategoryCard";
import ProductCard from "./components/ProductCard/ProductCard";
import { getRandomDarkColor } from "./components/CategoryCard/helpers";
import PageTittle from "../../components/PageTittle/PageTittle";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import { fetchCategories } from "../../redux/reducers/categories";
import {
  fetchAllProducts,
  fetchProductImages,
  fetchProductVariations,
  incrementStartRange,
  resetProducts,
} from "../../redux/reducers/products";

/** Cтраница с карточками всех товаров и категориями */
const Main = () => {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // получаем все нужные состояния из редакса
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.categories);
  const {
    loading,
    hasMore,
    products,
    productsImages,
    productsVariations,
    startRange,
  } = useSelector((state: RootState) => state.products);

  // айдишник выбранной категории
  const [selectedCategory, setSelectedCategory] = useState<number>();

  // загружаем все имеющиеся категории
  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories]);

  // подгружаем новую порцию товаров при изменении категории или "страницы"
  useEffect(() => {
    loadMoreProducts();
    // eslint-disable-next-line
  }, [startRange, selectedCategory]);

  /** Функция подгрузки товаров */
  const loadMoreProducts = () => {
    if (loading || !hasMore) return;

    dispatch(
      fetchAllProducts({
        startRange,
        selectedCategory,
      })
    );
  };

  // слушатель скролла
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          dispatch(incrementStartRange());
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
  }, [loading, hasMore, dispatch]);

  // подгружаем изображения и варианты товаров для новой порции товаров
  useEffect(() => {
    if (products.length) {
      // выбираем айдишники только для новой порции товаров, поскольку эндпоинт
      // не может вернуть так много элементов изображений и вариантов
      const productsIds = products
        ?.slice(startRange, startRange + 16)
        .map((item) => item.id);

      if (productsIds.length) {
        // загружаем изображения товаров
        dispatch(fetchProductImages(productsIds));
        // загружаем варианты товаров
        dispatch(fetchProductVariations(productsIds));
      }
    }
  }, [products, startRange, dispatch]);

  // генерируем рандомные цвета для отображения категорий
  const colors = useMemo(
    () => (categories ?? []).map(() => getRandomDarkColor()),
    [categories]
  );

  // при изменении категории очищаем список товаров, открываем возможность для загрузки с нуля
  const handleOnCategoryClick = (categoryId: number) => {
    if (categoryId !== selectedCategory) {
      dispatch(resetProducts());
      setSelectedCategory(categoryId);
    }
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
