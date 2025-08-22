"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  TrendingUp,
  Newspaper,
  BarChart3,
  User,
  Menu,
  X,
  Search,
  Settings,
  LogOut,
  Bookmark,
  Filter,
  DollarSign,
  ChevronDown
} from "lucide-react";
import { useState } from "react";
import { Company } from "@/types/stock";

const navigationItems = [
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

const filterMenuItems = [
  {
    title: "Xu hướng ngành",
    href: "/bo-loc-xu-huong-nganh",
    icon: Filter,
    description: "Phân tích xu hướng ngành với RRG và Beta",
  },
  {
    title: "Định giá",
    href: "/bo-loc-dinh-gia-hap-dan",
    icon: DollarSign,
    description: "Tìm cổ phiếu định giá hấp dẫn",
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
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container px-4 sm:px-6 lg:px-8 flex h-16 items-center">
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
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link
                  href="/ma-chung-khoan"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    pathname === "/ma-chung-khoan" && "bg-accent text-accent-foreground"
                  )}
                >
                  <TrendingUp className="mr-2 h-4 w-4 flex-shrink-0" />
                  Mã chứng khoán
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link
                  href="/tin-tuc"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    pathname === "/tin-tuc" && "bg-accent text-accent-foreground"
                  )}
                >
                  <Newspaper className="mr-2 h-4 w-4 flex-shrink-0" />
                  Tin tức
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link
                  href="/bieu-do-ky-thuat"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    pathname === "/bieu-do-ky-thuat" && "bg-accent text-accent-foreground"
                  )}
                >
                  <BarChart3 className="mr-2 h-4 w-4 flex-shrink-0" />
                  Biểu đồ kỹ thuật
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className={cn(
                    pathname.startsWith("/bo-loc") && "bg-accent text-accent-foreground"
                  )}
                >
                  <Filter className="mr-2 h-4 w-4 flex-shrink-0" />
                  Bộ lọc
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    {filterMenuItems.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              pathname === item.href && "bg-accent"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <item.icon className="h-4 w-4" />
                              <div className="text-sm font-medium leading-none">
                                {item.title}
                              </div>
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
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
        <div className="ml-auto flex items-center justify-end space-x-2">
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
          <div className="container px-4 sm:px-6 lg:px-8 py-3">
            <StockSearch
              onCompanySelect={handleCompanySelect}
              placeholder="Tìm kiếm mã chứng khoán..."
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="border-t md:hidden">
          <div className="container px-4 sm:px-6 lg:px-8 py-4">
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
              
              {/* Mobile Filter Menu */}
              <div className="pt-2 mt-2 border-t space-y-1">
                <div className="px-3 py-1 text-sm font-medium text-muted-foreground flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Bộ lọc
                </div>
                {filterMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 pl-9 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                ))}
              </div>

              {/* Mobile User Actions */}
              <div className="pt-4 mt-4 border-t space-y-2">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm font-medium text-muted-foreground">Cài đặt</span>
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
