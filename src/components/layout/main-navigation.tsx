"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SimpleThemeToggle } from "@/components/layout/theme-toggle";
import { StockSearch } from "@/components/forms/stock-search";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  TrendingUp,
  Newspaper,
  BarChart3,
  User,
  Menu,
  X,
  Search,
  Settings,
  LogOut,
  Bell,
  Bookmark
} from "lucide-react";
import { useState } from "react";
import { Company } from "@/types/stock";

const navigationItems = [
  {
    title: "Trang chủ",
    href: "/",
    icon: Home,
  },
  {
    title: "Mã chứng khoán",
    href: "/ma-chung-khoan",
    icon: TrendingUp,
  },
  {
    title: "Tin tức",
    href: "/tin-tuc",
    icon: Newspaper,
  },
  {
    title: "Biểu đồ kỹ thuật",
    href: "/bieu-do-ky-thuat",
    icon: BarChart3,
  },
  {
    title: "Tài khoản",
    href: "/tai-khoan",
    icon: User,
  },
];

export function MainNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Handle company selection from search
  const handleCompanySelect = (company: Company) => {
    try {
      router.push(`/ma-chung-khoan/${company.ticker.toLowerCase()}`);
      setIsSearchOpen(false); // Close mobile search if open
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location if router fails
      window.location.href = `/ma-chung-khoan/${company.ticker.toLowerCase()}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2 group">
          <div className="relative">
            <TrendingUp className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 h-7 w-7 bg-gradient-to-r from-primary to-blue-600 opacity-20 rounded-full blur-sm group-hover:opacity-40 transition-opacity" />
          </div>
          <div className="hidden md:flex flex-col">
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              IQX
            </span>
            <span className="text-xs text-muted-foreground font-normal">
              Vietnam Stock Express
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex">
          <ul className="flex items-center space-x-1">
            <li>
              <Link
                href="/"
                className={cn(
                  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                  pathname === "/" && "bg-accent text-accent-foreground"
                )}
              >
                <Home className="mr-2 h-4 w-4 flex-shrink-0" />
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                href="/ma-chung-khoan"
                className={cn(
                  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                  pathname === "/ma-chung-khoan" && "bg-accent text-accent-foreground"
                )}
              >
                <TrendingUp className="mr-2 h-4 w-4 flex-shrink-0" />
                Mã chứng khoán
              </Link>
            </li>
            <li>
              <Link
                href="/tin-tuc"
                className={cn(
                  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                  (pathname === "/news" || pathname.startsWith("/news/")) && "bg-accent text-accent-foreground"
                )}
              >
                <Newspaper className="mr-2 h-4 w-4 flex-shrink-0" />
                Tin tức
              </Link>
            </li>
            <li>
              <Link
                href="/bieu-do-ky-thuat"
                className={cn(
                  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                  pathname === "/bieu-do-ky-thuat" && "bg-accent text-accent-foreground"
                )}
              >
                <BarChart3 className="mr-2 h-4 w-4 flex-shrink-0" />
                Biểu đồ kỹ thuật
              </Link>
            </li>
          </ul>
        </nav>

        {/* Search Bar - Desktop */}
        <div className="flex-1 max-w-sm mx-4 hidden lg:block">
          <StockSearch
            onCompanySelect={handleCompanySelect}
            placeholder="Tìm kiếm mã chứng khoán..."
            className="w-full [&>div>input]:h-9 [&>div>input]:bg-muted/50 [&>div>input]:border-0 [&>div>input]:focus-visible:ring-1 [&>div>input]:focus-visible:ring-ring [&>div>div]:shadow-lg"
          />
        </div>

        {/* Search Bar - Tablet */}
        <div className="flex-1 max-w-xs mx-2 hidden md:block lg:hidden">
          <StockSearch
            onCompanySelect={handleCompanySelect}
            placeholder="Tìm kiếm..."
            className="w-full [&>div>input]:h-9 [&>div>input]:bg-muted/50 [&>div>input]:border-0 [&>div>input]:focus-visible:ring-1 [&>div>input]:focus-visible:ring-ring [&>div>div]:shadow-lg"
          />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center justify-end space-x-2">
          {/* Search Button for Mobile */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label={isSearchOpen ? "Đóng tìm kiếm" : "Mở tìm kiếm"}
          >
            {isSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex relative"
            aria-label="Thông báo"
          >
            <Bell className="h-4 w-4" />
            <span
              className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"
              aria-label="Có thông báo mới"
            ></span>
          </Button>

          {/* Theme Toggle */}
          <SimpleThemeToggle />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <User className="h-4 w-4 mr-2" />
                <span className="hidden lg:inline">Tài khoản</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/tai-khoan">
                  <User className="mr-2 h-4 w-4" />
                  Hồ sơ cá nhân
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bookmark className="mr-2 h-4 w-4" />
                Danh sách theo dõi
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Cài đặt
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="border-t md:hidden">
          <div className="container py-3">
            <StockSearch
              onCompanySelect={handleCompanySelect}
              placeholder="Tìm kiếm mã chứng khoán..."
              className="w-full [&>div>div]:shadow-lg"
            />
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="border-t md:hidden">
          <div className="container py-4">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              ))}

              {/* Mobile User Actions */}
              <div className="pt-4 mt-4 border-t space-y-2">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm font-medium text-muted-foreground">Cài đặt</span>
                  <SimpleThemeToggle />
                </div>
                <Link
                  href="/tai-khoan"
                  className="flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Cài đặt tài khoản
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
