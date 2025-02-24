import { Category } from "../redux/types";
import { fetchApiWrapper } from "./helpers";

export const getCategories = (): Promise<Category[]> =>
  fetchApiWrapper({ path: "/Categories" });
