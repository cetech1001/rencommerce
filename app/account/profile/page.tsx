"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ProfileForm } from "./ProfileForm";
import { getAuthSession } from "@/lib/actions/auth";
import type { IUser } from "@/lib/types";
import { getUserByID } from "@/lib/queries/user";

export default function AccountProfilePage() {
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

      const user = await getUserByID(session.user.id);
      
      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);
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
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
