import React from 'react';
import { useRouter } from 'next/router';

const EditCategory: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Category</h1>
      <p className="text-gray-600">Editing category with ID: {id}</p>
      
      {/* TODO: Implement edit category form */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">
          This page is under development. Please implement the edit category functionality.
        </p>
      </div>
    </div>
  );
};

export default EditCategory;
