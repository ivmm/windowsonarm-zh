import { Category, Tag } from "@prisma/client";
import { StatusWithPercentage } from "@/app/api/v1/info/route";

export interface InfoResponse {
  categories: Category[];
  status: StatusWithPercentage[];
  tags: Tag[];
}
