import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getProductById } from "@/lib/catalog";
import { Product } from "@/types/catalog";
import Image from "next/image";

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        const productData = await getProductById(id as string);
        setProduct(productData);
        if (productData && productData.images.length > 0) {
          setSelectedImage(productData.images[0]);
        }
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/2">
          <div className="relative h-96 mb-4">
            <Image src={selectedImage} alt={product.name} layout="fill" objectFit="cover" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <div key={index} className="relative w-20 h-20 cursor-pointer" onClick={() => setSelectedImage(image)}>
                <Image src={image} alt={`${product.name} - Image ${index + 1}`} layout="fill" objectFit="cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="md:w-1/2">
          <p className="text-xl mb-2">${product.price}</p>
          <p className="mb-4">{product.description}</p>
          <div className="mb-4">
            <label className="block mb-2">Size</label>
            <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className="border p-2 w-full">
              <option value="">Select Size</option>
              <option value="S">Small</option>
              <option value="M">Medium</option>
              <option value="L">Large</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Color</label>
            <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className="border p-2 w-full">
              <option value="">Select Color</option>
              <option value="Red">Red</option>
              <option value="Blue">Blue</option>
              <option value="Green">Green</option>
            </select>
          </div>
          <button className="bg-blue-500 text-white p-2 rounded">Add to Cart</button>
        </div>
      </div>
    </div>
  );
} 