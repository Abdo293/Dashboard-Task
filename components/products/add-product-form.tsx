"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createProduct } from "@/store/slices/productsSlice";
import type { CreateProductData } from "@/types/productTypes.ts";
import { useLocale, useTranslations } from "next-intl";

interface FormData {
  product_name: string;
  product_name_en: string;
  product_description: string;
  product_description_en: string;
  number_of_pieces: string;
  product_price: string;
  price_after_discount: string;
  discount: string;
  product_hidden: "yes" | "no";
}

interface FormErrors {
  product_name?: string;
  product_name_en?: string;
  product_description?: string;
  product_description_en?: string;
  number_of_pieces?: string;
  product_price?: string;
  price_after_discount?: string;
  discount?: string;
}

interface AddProductFormProps {
  onSuccess?: () => void;
}

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label: string;
  placeholder: string;
  maxLength?: number;
  hint?: string;
}

const ProductNameInput: React.FC<InputProps> = ({
  value,
  onChange,
  error,
  label,
  placeholder,
  maxLength,
  hint,
}) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium">
      {label} <span className="text-red-500">*</span>
    </Label>
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full"
      maxLength={maxLength}
    />
    {hint && <p className="text-xs text-gray-500">{hint}</p>}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const DescriptionInput: React.FC<InputProps> = ({
  value,
  onChange,
  label,
  placeholder,
  error,
  maxLength,
  hint,
}) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium">
      {label} <span className="text-red-500">*</span>
    </Label>
    <Textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full min-h-[100px] resize-none"
      maxLength={maxLength}
    />
    {hint && <p className="text-xs text-gray-500">{hint}</p>}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const PriceInputs: React.FC<{
  price: string;
  priceAfterDiscount: string;
  discount: string;
  onChange: (field: string, value: string) => void;
  errors: FormErrors;
  t: any;
}> = ({ price, priceAfterDiscount, discount, onChange, errors, t }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {t("productPrice")} <span className="text-red-500">*</span>
      </Label>
      <Input
        type="number"
        step="0.01"
        placeholder={t("placeholders.price")}
        value={price}
        onChange={(e) => onChange("product_price", e.target.value)}
      />
      {errors.product_price && (
        <p className="text-xs text-red-500">{errors.product_price}</p>
      )}
    </div>

    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {t("priceAfterDiscount")} <span className="text-red-500">*</span>
      </Label>
      <Input
        type="number"
        step="0.01"
        placeholder={t("placeholders.price")}
        value={priceAfterDiscount}
        onChange={(e) => onChange("price_after_discount", e.target.value)}
      />
      {errors.price_after_discount && (
        <p className="text-xs text-red-500">{errors.price_after_discount}</p>
      )}
    </div>

    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {t("discount")} <span className="text-red-500">*</span>
      </Label>
      <Input
        type="number"
        step="0.1"
        placeholder={t("placeholders.pieces")}
        value={discount}
        onChange={(e) => onChange("discount", e.target.value)}
      />
      {errors.discount && (
        <p className="text-xs text-red-500">{errors.discount}</p>
      )}
    </div>
  </div>
);

const AddProductForm: React.FC<AddProductFormProps> = ({ onSuccess }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.products);
  const t = useTranslations("addProduct");
  const locale = useLocale();

  const [formData, setFormData] = useState<FormData>({
    product_name: "",
    product_name_en: "",
    product_description: "",
    product_description_en: "",
    number_of_pieces: "",
    product_price: "",
    price_after_discount: "",
    discount: "",
    product_hidden: "no",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.product_name.trim()) {
      newErrors.product_name = t("errors.productNameArRequired");
    }
    if (!formData.product_name_en.trim()) {
      newErrors.product_name_en = t("errors.productNameEnRequired");
    }
    if (!formData.product_description.trim()) {
      newErrors.product_description = t("errors.descriptionArRequired");
    }
    if (!formData.product_description_en.trim()) {
      newErrors.product_description_en = t("errors.descriptionEnRequired");
    }
    if (
      !formData.number_of_pieces ||
      Number.parseInt(formData.number_of_pieces) <= 0
    ) {
      newErrors.number_of_pieces = t("errors.numberOfPiecesInvalid");
    }
    if (
      !formData.product_price ||
      Number.parseFloat(formData.product_price) <= 0
    ) {
      newErrors.product_price = t("errors.productPriceInvalid");
    }
    if (
      !formData.price_after_discount ||
      Number.parseFloat(formData.price_after_discount) <= 0
    ) {
      newErrors.price_after_discount = t("errors.priceAfterDiscountInvalid");
    }
    if (!formData.discount || Number.parseFloat(formData.discount) < 0) {
      newErrors.discount = t("errors.discountInvalid");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      const productData: CreateProductData = {
        product_name: formData.product_name,
        product_name_en: formData.product_name_en,
        product_description: formData.product_description,
        product_description_en: formData.product_description_en,
        number_of_pieces: Number.parseInt(formData.number_of_pieces),
        product_price: Number.parseFloat(formData.product_price),
        price_after_discount: Number.parseFloat(formData.price_after_discount),
        discount: Number.parseFloat(formData.discount),
        product_hidden: formData.product_hidden,
      };

      await dispatch(createProduct(productData)).unwrap();

      setFormData({
        product_name: "",
        product_name_en: "",
        product_description: "",
        product_description_en: "",
        number_of_pieces: "",
        product_price: "",
        price_after_discount: "",
        discount: "",
        product_hidden: "no",
      });
      setErrors({});

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 500);
    } catch (err) {
      console.error("Failed to create product:", err);
    }
  };

  const handlePriceChange = (field: string, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFieldChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field in errors && errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <ProductNameInput
        value={formData.product_name}
        onChange={(val) => handleFieldChange("product_name", val)}
        error={errors.product_name}
        label={t("productNameAr")}
        placeholder={t("placeholders.productNameAr")}
        maxLength={20}
        hint={t("hints.productName")}
      />

      <ProductNameInput
        value={formData.product_name_en}
        onChange={(val) => handleFieldChange("product_name_en", val)}
        error={errors.product_name_en}
        label={t("productNameEn")}
        placeholder={t("placeholders.productNameEn")}
        maxLength={20}
      />

      <PriceInputs
        price={formData.product_price}
        priceAfterDiscount={formData.price_after_discount}
        discount={formData.discount}
        onChange={handlePriceChange}
        errors={errors}
        t={t}
      />

      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t("numberOfPieces")} <span className="text-red-500">*</span>
        </Label>
        <Input
          type="number"
          placeholder={t("placeholders.pieces")}
          value={formData.number_of_pieces}
          onChange={(e) =>
            handleFieldChange("number_of_pieces", e.target.value)
          }
        />
        {errors.number_of_pieces && (
          <p className="text-xs text-red-500">{errors.number_of_pieces}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t("productVisibility")} <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.product_hidden}
          onValueChange={(val: "yes" | "no") =>
            setFormData((prev) => ({ ...prev, product_hidden: val }))
          }
        >
          <SelectTrigger
            className="w-full"
            dir={`${locale === "ar" ? "rtl" : "ltr"}`}
          >
            <SelectValue placeholder={t("placeholders.selectVisibility")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no">{t("visible")}</SelectItem>
            <SelectItem value="yes">{t("hidden")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DescriptionInput
        value={formData.product_description}
        onChange={(val) => handleFieldChange("product_description", val)}
        label={t("productDescription")}
        placeholder={t("placeholders.productDescriptionAr")}
        error={errors.product_description}
        maxLength={100}
        hint={t("hints.productDescription")}
      />

      <DescriptionInput
        value={formData.product_description_en}
        onChange={(val) => handleFieldChange("product_description_en", val)}
        label={t("productDescriptionEn")}
        placeholder={t("placeholders.productDescriptionEn")}
        error={errors.product_description_en}
        maxLength={100}
      />

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {loading ? t("buttons.adding") : t("buttons.addProduct")}
      </Button>
    </div>
  );
};

export default AddProductForm;
