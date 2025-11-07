"use client";

import type React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/productTypes.ts";
import { useTranslations, useLocale } from "next-intl";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
}) => {
  const t = useTranslations("productsList");
  const locale = useLocale();
  const isRTL = locale === "ar";

  if (products.length === 0) {
    return (
      <div className="rounded-lg bg-white dark:bg-[#262626] p-12 text-center text-muted-foreground">
        {t("noProductsFound")}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-x-auto bg-white dark:bg-[#262626]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th
              className={`${
                isRTL ? "text-right" : "text-left"
              } p-4 text-foreground font-semibold`}
            >
              {t("table.product")}
            </th>
            <th
              className={`${
                isRTL ? "text-right" : "text-left"
              } p-4 text-foreground font-semibold`}
            >
              {t("table.productId")}
            </th>
            <th
              className={`${
                isRTL ? "text-right" : "text-left"
              } p-4 text-foreground font-semibold`}
            >
              {t("table.price")}
            </th>
            <th
              className={`${
                isRTL ? "text-right" : "text-left"
              } p-4 text-foreground font-semibold`}
            >
              {t("table.quantity")}
            </th>
            <th
              className={`${
                isRTL ? "text-right" : "text-left"
              } p-4 text-foreground font-semibold`}
            >
              {t("table.discount")}
            </th>
            <th
              className={`${
                isRTL ? "text-right" : "text-left"
              } p-4 text-foreground font-semibold`}
            >
              {t("table.status")}
            </th>
            <th
              className={`${
                isRTL ? "text-right" : "text-left"
              } p-4 text-foreground font-semibold`}
            >
              {t("table.finalPrice")}
            </th>
            <th
              className={`${
                isRTL ? "text-left" : "text-right"
              } p-4 text-foreground font-semibold`}
            >
              {t("table.action")}
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.product_id}
              className="border-b border-border hover:bg-muted/50 transition-colors"
            >
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-xs text-muted-foreground">IMG</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-foreground font-medium truncate">
                      {isRTL ? product.product_name : product.product_name_en}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {isRTL ? product.product_name_en : product.product_name}
                    </p>
                  </div>
                </div>
              </td>
              <td className="p-4 text-muted-foreground">
                #{product.product_id}
              </td>
              <td className="p-4 text-foreground font-medium">
                ${product.product_price.toFixed(2)}
              </td>
              <td className="p-4 text-foreground">
                {product.number_of_pieces.toLocaleString()}
              </td>
              <td className="p-4 text-foreground">{product.discount}%</td>
              <td className="p-4">
                {product.number_of_pieces > 0 ? (
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-500 border-green-500/20"
                  >
                    {t("status.inStock")}
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-orange-500/10 text-orange-500 border-orange-500/20"
                  >
                    {t("status.outOfStock")}
                  </Badge>
                )}
              </td>
              <td className="p-4 text-foreground font-semibold">
                ${product.price_after_discount.toFixed(2)}
              </td>
              <td className="p-4">
                <div
                  className={`flex items-center ${
                    isRTL ? "justify-start" : "justify-end"
                  } gap-2`}
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit(product)}
                    className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(product.product_id!)}
                    className="h-8 w-8 text-orange-500 hover:text-orange-600 hover:bg-orange-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
