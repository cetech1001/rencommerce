import { ProductForm } from "../../ProductForm";

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  return <ProductForm productId={params.id} />;
}
