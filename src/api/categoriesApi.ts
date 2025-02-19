import { fetchApiWrapper } from "./helpers";

export type Category = {
  id: number;
  name: string;
  parent_id: number;
};

export const getCategories = (): Promise<Category[]> =>
  fetchApiWrapper({ path: "/Categories" });
