import React, { FC } from "react";
import css from "./index.module.css";

type Props = {
  categoryName: string;
  color: string;
  onClick: () => void;
};

/** Тег категории */
const CategoryCard: FC<Props> = ({ categoryName, color, onClick }) => {
  return (
    <div
      className={css.container}
      style={{ backgroundColor: `${color}` }}
      onClick={onClick}
    >
      {categoryName}
    </div>
  );
};

export default CategoryCard;
