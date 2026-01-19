"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ProfileForm } from "@/lib/components/shared/ProfileForm";
import { getAuthSession } from "@/lib/actions/auth";
import type { IUser } from "@/lib/types";

export default function AdminProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const session = await getAuthSession();

      if (!session.user) {
        router.push("/login");
        return;
      }

      if (session.user.role !== "ADMIN") {
        router.push("/");
        return;
      }

      setUser(session.user as IUser);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-8 sm:py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">My Profile</h1>
        <ProfileForm user={user} isAdmin />
      </div>
    </div>
  );
}
