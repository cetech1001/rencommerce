"use client";

import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import type { IUser } from "@/lib/types";

interface UserFormModalProps {
  user: IUser | null;
  onClose: () => void;
}

export function UserFormModal({ user, onClose }: UserFormModalProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "CUSTOMER",
    phone: user?.phone || "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (user) {
        // Update existing user
        const { updateUser, updateUserPhone, updateUserPassword } = await import("@/lib/actions/user");

        // Update basic info if changed
        if (formData.name !== user.name || formData.email !== user.email || formData.role !== user.role) {
          const result = await updateUser({
            id: user.id,
            name: formData.name,
            email: formData.email,
            role: formData.role as "ADMIN" | "CUSTOMER",
          });

          if (!result.success) {
            setError(result.error || "Failed to update user");
            setLoading(false);
            return;
          }
        }

        // Update phone if changed
        if (formData.phone !== (user.phone || "")) {
          const result = await updateUserPhone(user.id, formData.phone, true);
          if (!result.success) {
            setError(result.error || "Failed to update phone");
            setLoading(false);
            return;
          }
        }

        // Update password if provided
        if (formData.password) {
          const result = await updateUserPassword(user.id, formData.password, undefined, true);
          if (!result.success) {
            setError(result.error || "Failed to update password");
            setLoading(false);
            return;
          }
        }
      } else {
        // Create new user
        const { createUser } = await import("@/lib/actions/user");
        const result = await createUser({
          name: formData.name,
          email: formData.email,
          role: formData.role as "ADMIN" | "CUSTOMER",
          password: formData.password,
        });

        if (!result.success) {
          setError(result.error || "Failed to create user");
          setLoading(false);
          return;
        }

        // Add phone if provided
        if (formData.phone && result.user) {
          const { updateUserPhone } = await import("@/lib/actions/user");
          await updateUserPhone(result.user.id, formData.phone, true);
        }
      }

      onClose();
    } catch (err) {
      setError("Failed to save user");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">
            {user ? "Edit User" : "Create User"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={!!user}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted disabled:cursor-not-allowed"
              title={user ? "Email cannot be changed" : ""}
            />
            {user && <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Phone {!user && <span className="text-muted-foreground">(Optional)</span>}
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password {user && <span className="text-muted-foreground">(Leave blank to keep current)</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required={!user}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 pr-10 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                minLength={6}
                placeholder={user ? "Enter new password" : "Enter password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as "CUSTOMER" | "ADMIN",
                })
              }
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : user ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
