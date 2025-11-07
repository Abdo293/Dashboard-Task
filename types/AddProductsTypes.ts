export interface FormData {
  product_name: string;
  product_name_en: string;
  product_description: string;
  product_description_en: string;
  number_of_pieces: string;
  product_price: string;
  price_after_discount: string;
  discount: string;
  product_hidden: "yes" | "no";
  location?: { lat: number; lng: number };
}

export interface FormErrors {
  product_name?: string;
  product_name_en?: string;
  product_description?: string;
  product_description_en?: string;
  number_of_pieces?: string;
  product_price?: string;
  price_after_discount?: string;
  discount?: string;
}

export interface AddProductFormProps {
  onSuccess?: () => void;
}

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label: string;
  placeholder: string;
  maxLength?: number;
  hint?: string;
}
