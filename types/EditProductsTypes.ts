import { Product } from "./productTypes.ts";

export interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export interface EditForm {
  product_name: string;
  product_name_en: string;
  product_price: string;
  number_of_pieces: string;
  discount: string;
  product_description: string;
  product_description_en: string;
  location?: { lat: number; lng: number };
}
