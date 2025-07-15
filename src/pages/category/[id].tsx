import { GetServerSideProps } from 'next';
import { getCategoryById, getProductsByCategory } from '@/lib/catalog';
import { Category, Product } from '@/types/catalog';
import Link from 'next/link';
import Image from 'next/image';

interface CategoryPageProps {
  category: Category | null;
  products: Product[];
}

export default function CategoryPage({ category, products }: CategoryPageProps) {
  if (!category) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
        <p className="text-gray-600 mb-4">Sorry, this category does not exist.</p>
        <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        {category.description && <p className="text-gray-600 mb-2">{category.description}</p>}
        {category.imageUrl && (
          <div className="relative w-32 h-32 mb-4">
            <Image src={category.imageUrl} alt={category.name} fill className="object-cover rounded" />
          </div>
        )}
      </div>
      <h2 className="text-2xl font-semibold mb-4">Products in this Category</h2>
      {products.length === 0 ? (
        <p className="text-gray-500">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id}>
              <div className="border p-4 rounded hover:bg-gray-100">
                {product.images.length > 0 && (
                  <div className="relative w-full h-48 mb-2">
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover rounded" />
                  </div>
                )}
                <h3 className="font-bold">{product.name}</h3>
                <p>${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  const category = await getCategoryById(id);
  if (!category) {
    return { props: { category: null, products: [] } };
  }
  const products = await getProductsByCategory(id);
  return { props: { category, products } };
}; 