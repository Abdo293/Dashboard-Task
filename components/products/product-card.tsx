"use client";

import type React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/types/productTypes.ts";
import { useTranslations } from "next-intl";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  const t = useTranslations("productsList");

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
            <span className="text-xs text-muted-foreground">IMG</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {product.product_name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {product.product_name_en}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("table.productId")}: #{product.product_id}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              {t("table.price")}
            </p>
            <p className="font-semibold text-foreground">
              ${product.product_price.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              {t("table.finalPrice")}
            </p>
            <p className="font-semibold text-foreground">
              ${product.price_after_discount.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              {t("table.quantity")}
            </p>
            <p className="text-foreground">
              {product.number_of_pieces.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              {t("table.discount")}
            </p>
            <p className="text-foreground">{product.discount}%</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
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
          </div>
          <div className="flex gap-2">
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
