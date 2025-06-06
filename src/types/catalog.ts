// Types for the catalog system
export type Category = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  slug: string;
  parentId?: string;
  createdAt: number;
  updatedAt: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  categoryIds: string[];
  stock: number;
  sku?: string;
  featured: boolean;
  slug: string;
  metadata?: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
};
