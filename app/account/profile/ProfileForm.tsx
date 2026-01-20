"use client";

import { useEffect, useState } from "react";
import { User, Mail, Calendar, Shield, Phone, Eye, EyeOff } from "lucide-react";
import type { IUser } from "@/lib/types";
import { Toast, ToastType } from "@/lib/components/client";

interface ProfileFormProps {
  user: IUser;
  isAdmin?: boolean;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [newUser, setNewUser] = useState<IUser>();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);

  const fetchUser = async () => {
    const { getUserByID } = await import("@/lib/queries");
    const data = await getUserByID(user.id);
    if (data) {
      console.log("Fetched data: ", data);
      setNewUser(data);
    }
  }

  useEffect(() => {
    if (newUser) {
      setFormData({
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone || "",
      });
    }
  }, [newUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const { updateUser } = await import("@/lib/actions");

      const result = await updateUser({
        id: user.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone === '' ? undefined : formData.phone,
      });

      if (!result.success) {
        setToast({ message: result.error || "Failed to update phone", type: 'error' });
        setUpdating(false);
        return;
      }

      setToast({ message: "Profile updated successfully!", type: "success" });
      setIsEditing(false);
      const timeoutID = setTimeout(() => {
        window.location.reload();
        clearTimeout(timeoutID);
      }, 1500);
    } catch (error) {
      console.error("Error updating profile:", error);
      setToast({ message: "Failed to update profile", type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({ message: "New passwords do not match", type: 'error' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setToast({ message: "Password must be at least 6 characters long", type: 'error' });
      return;
    }

    setUpdating(true);

    try {
      const { updateUserPassword } = await import("@/lib/actions");
      const result = await updateUserPassword(
        user.id,
        passwordData.newPassword,
        passwordData.currentPassword
      );

      if (result.success) {
        setToast({ message: "Password updated successfully!", type: "success" });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setIsChangingPassword(false);
      } else {
        setToast({ message: result.error || "Failed to update password", type: 'error' });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setToast({ message: "Failed to update password", type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Profile Information</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your account details
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
                // disabled
                // title="Email cannot be changed"
              />
              {/* <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p> */}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={updating}
                className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {updating ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ name: user.name, email: user.email, phone: user.phone || "" });
                }}
                className="px-6 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Name */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="text-base font-medium text-foreground mt-1">{user.name}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="text-base font-medium text-foreground mt-1">{user.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-fuchsia-100 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-fuchsia-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="text-base font-medium text-foreground mt-1">{user.phone || 'N/A'}</p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Account Role</p>
                <div className="mt-1">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === "ADMIN"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Member Since */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="text-base font-medium text-foreground mt-1">
                  {user.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Password Change Section */}
      {!isEditing && (
        <div className="border-t border-border">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Change Password</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Update your account password
                </p>
              </div>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
                >
                  Change Password
                </button>
              )}
            </div>

            {isChangingPassword && (
              <form onSubmit={handlePasswordChange} className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                      className="w-full px-4 py-2 pr-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                      className="w-full px-4 py-2 pr-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({ ...showPasswords, new: !showPasswords.new })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                      className="w-full px-4 py-2 pr-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {updating ? "Updating..." : "Update Password"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                    className="px-6 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
