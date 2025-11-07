export interface Product {
  product_id?: number;
  product_name: string;
  product_description: string;
  number_of_pieces: number;
  product_price: number;
  price_after_discount: number;
  discount: number;
  product_name_en: string;
  product_description_en: string;
  product_hidden: "yes" | "no";
}

export interface CreateProductData extends Omit<Product, "product_id"> {}

export interface UpdateProductData extends Product {
  product_id: number;
}

export interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  currentProduct: Product | null;
}
