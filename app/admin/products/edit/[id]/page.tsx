import { ProductForm } from "../../ProductForm";

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const id = (await params).id
  return <ProductForm productID={id} />;
}
