"use client";

import Link from "next/link";
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard, Package } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/lib/contexts/CartContext";
import { logoutAction } from "@/lib/actions/auth.actions";
import type { SessionUser } from "@/lib/types";
import { clientConfig } from "../../config.client";

interface HeaderClientProps {
  user: SessionUser | null;
}

export function HeaderClient({ user }: HeaderClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { label: "Rent", href: "/rent" },
    { label: "Buy", href: "/purchase" },
    { label: "Products", href: "/products" },
  ];

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutAction();
    setShowUserMenu(false);
    router.push("/");
    router.refresh();
  };

  const adminMenuItems = [
    { label: "Admin Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Profile", href: "/account/profile", icon: User },
  ];

  const userMenuItems = [
    { label: "Profile", href: "/account/profile", icon: User },
    { label: "Orders", href: "/account/orders", icon: Package },
  ];

  const menuItems = user?.role === "ADMIN" ? adminMenuItems : userMenuItems;

  // Create login URL with returnUrl query param
  const loginUrl = `/auth/login?returnUrl=${encodeURIComponent(pathname)}`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-foreground hidden sm:inline">
            {clientConfig.app.name}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/cart"
            className="relative p-2 text-foreground hover:text-primary transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {user.name}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-border rounded-lg shadow-lg py-2">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-primary mt-1">{user.role}</p>
                  </div>

                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    );
                  })}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-border mt-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href={loginUrl}
              className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-all duration-200"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/cart"
              className="block py-2 text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingCart className="w-4 h-4" />
              Cart {cartCount > 0 && `(${cartCount})`}
            </Link>

            {user ? (
              <>
                <div className="border-t border-border pt-3 mt-3">
                  <p className="text-sm font-medium text-foreground mb-2">{user.name}</p>
                  <p className="text-xs text-muted-foreground mb-1">{user.email}</p>
                  <p className="text-xs text-primary">{user.role}</p>
                </div>

                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href={loginUrl}
                className="block w-full px-6 py-2 rounded-lg bg-primary text-white font-medium text-center hover:bg-primary/90 transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
