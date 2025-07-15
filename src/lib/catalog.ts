import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query,
  where
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
import { Category, Product } from "@/types/catalog";

const CATEGORIES_COLLECTION = "categories";
const PRODUCTS_COLLECTION = "products";

// Validate Firebase connection
const validateFirebase = () => {
  if (!db) {
    throw new Error("Firebase database is not initialized. Please check your environment variables.");
  }
  if (!storage) {
    throw new Error("Firebase storage is not initialized. Please check your environment variables.");
  }
};

// Category Management
export const createCategory = async (categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  try {
    validateFirebase();
    const now = Date.now();
    const newCategory = {
      ...categoryData,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), newCategory);
    return docRef.id;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCategory = async (id: string, categoryData: Partial<Omit<Category, "id" | "createdAt" | "updatedAt">>): Promise<void> => {
  try {
    validateFirebase();
    const categoryRef = doc(db, CATEGORIES_COLLECTION, id);
    await updateDoc(categoryRef, {
      ...categoryData,
      updatedAt: Date.now()
    });
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    validateFirebase();
    const categoryRef = doc(db, CATEGORIES_COLLECTION, id);
    await deleteDoc(categoryRef);
    
    // You might want to handle updating products that are in this category
    // Or implement a cascade delete based on your app's requirements
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

export const getAllCategories = async (): Promise<Category[]> => {
  try {
    validateFirebase();
    const querySnapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }) as Category);
  } catch (error) {
    console.error("Error getting categories:", error);
    throw error;
  }
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    validateFirebase();
    const categoryRef = doc(db, CATEGORIES_COLLECTION, id);
    const categorySnap = await getDoc(categoryRef);
    
    if (categorySnap.exists()) {
      return {
        id: categorySnap.id,
        ...categorySnap.data()
      } as Category;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting category:", error);
    throw error;
  }
};

// Product Management
export const createProduct = async (productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  try {
    validateFirebase();
    const now = Date.now();
    const newProduct = {
      ...productData,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), newProduct);
    return docRef.id;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (id: string, productData: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>): Promise<void> => {
  try {
    validateFirebase();
    const productRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: Date.now()
    });
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    validateFirebase();
    const productRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(productRef);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    validateFirebase();
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }) as Product);
  } catch (error) {
    console.error("Error getting products:", error);
    throw error;
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    validateFirebase();
    if (!id) {
      console.warn("getProductById called with empty id");
      return null;
    }
    const productRef = doc(db, PRODUCTS_COLLECTION, id);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      return {
        id: productSnap.id,
        ...productSnap.data()
      } as Product;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting product:", error);
    throw error;
  }
};

export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  try {
    validateFirebase();
    const productsQuery = query(
      collection(db, PRODUCTS_COLLECTION), 
      where("categoryIds", "array-contains", categoryId)
    );
    
    const querySnapshot = await getDocs(productsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }) as Product);
  } catch (error) {
    console.error("Error getting products by category:", error);
    throw error;
  }
};

// Image Upload
export const uploadProductImage = async (file: File, productId: string): Promise<string> => {
  try {
    validateFirebase();
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `products/${productId}/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading product image:", error);
    throw error;
  }
};
