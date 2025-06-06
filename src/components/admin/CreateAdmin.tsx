"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function CreateAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleCreateAdmin = async () => {
    if (!email || !password) {
      setStatus("error");
      setMessage("Email and password are required");
      return;
    }

    try {
      setStatus("loading");
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      // Add user to Firestore with admin role
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "admin",
        createdAt: Date.now()
      });

      setStatus("success");
      setMessage(`Admin user created successfully: ${email}`);
        // Clear form
      setEmail("");
      setPassword("");
    } catch (error: unknown) {
      setStatus("error");
      
      // Handle the error with proper type checking
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Failed to create admin user");
      }
      console.error("Error creating admin:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create Admin User</h2>
      
      {status === "success" && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}
      
      {status === "error" && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      <button
        onClick={handleCreateAdmin}
        disabled={status === "loading"}
        className={`w-full py-2 px-4 rounded ${
          status === "loading" 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {status === "loading" ? "Creating..." : "Create Admin User"}
      </button>
    </div>
  );
}
