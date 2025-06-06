// Can only be accessed directly, not through normal navigation
import CreateAdmin from "@/components/admin/CreateAdmin";

export default function SetupAdminPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Setup</h1>
          <p className="text-gray-600 mt-2">
            Create an admin account for your application
          </p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <CreateAdmin />
          
          <div className="mt-6 text-sm text-gray-500">
            <p className="font-medium">Important:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>This page should only be used for initial setup.</li>
              <li>For security, disable or remove this page after creating your admin account.</li>
              <li>Use a strong password for your admin account.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
