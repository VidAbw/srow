// Sample data for testing the shop functionality
// This can be used to populate Firebase with test data

export const sampleCategories = [
  {
    name: "Shirts",
    description: "Premium quality shirts with Japanese and Sri Lankan influences",
    slug: "shirts",
  },
  {
    name: "Pants", 
    description: "Comfortable and stylish pants for all occasions",
    slug: "pants",
  },
  {
    name: "Accessories",
    description: "Complete your look with our curated accessories",
    slug: "accessories",
  }
];

export const sampleProducts = [
  {
    name: "Zen Garden Shirt",
    description: "A minimalist shirt inspired by Japanese zen gardens. Made with premium cotton.",
    price: 89.99,
    stock: 25,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"],
    categoryIds: [], // Will be populated after categories are created
    isActive: true,
  },
  {
    name: "Ceylon Tea Blend Tee",
    description: "Soft cotton t-shirt celebrating Sri Lankan tea culture.",
    price: 45.99,
    stock: 30,
    images: ["https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=400&fit=crop"],
    categoryIds: [],
    isActive: true,
  },
  {
    name: "Minimalist Chino Pants",
    description: "Clean-lined chino pants perfect for any occasion.",
    price: 120.00,
    stock: 20,
    images: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop"],
    categoryIds: [],
    isActive: true,
  }
];
