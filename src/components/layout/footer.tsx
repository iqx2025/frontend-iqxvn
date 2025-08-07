"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  TrendingUp, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Youtube,
  Send,
  ExternalLink
} from "lucide-react";

const footerLinks = {
  company: [
    { title: "Về chúng tôi", href: "/ve-chung-toi" },
    { title: "Liên hệ", href: "/lien-he" },
    { title: "Tuyển dụng", href: "/tuyen-dung" },
    { title: "Báo chí", href: "/bao-chi" },
  ],
  services: [
    { title: "Mã chứng khoán", href: "/ma-chung-khoan" },
    { title: "Tin tức", href: "/tin-tuc" },
    { title: "Biểu đồ kỹ thuật", href: "/bieu-do-ky-thuat" },
    { title: "Phân tích thị trường", href: "/phan-tich" },
  ],
  support: [
    { title: "Trung tâm hỗ trợ", href: "/ho-tro" },
    { title: "Hướng dẫn sử dụng", href: "/huong-dan" },
    { title: "FAQ", href: "/faq" },
    { title: "API Documentation", href: "/api-docs" },
  ],
  legal: [
    { title: "Điều khoản sử dụng", href: "/dieu-khoan" },
    { title: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
    { title: "Chính sách cookie", href: "/chinh-sach-cookie" },
    { title: "Khuyến cáo rủi ro", href: "/khuyen-cao-rui-ro" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com/iqx-vietnam", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com/iqx-vietnam", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com/company/iqx-vietnam", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com/@iqx-vietnam", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div className="absolute inset-0 h-8 w-8 bg-gradient-to-r from-primary to-blue-600 opacity-20 rounded-full blur-sm" />
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                IQX
              </span>
            </div>
            <div className="space-y-4 text-sm">
              {/* Company Names */}
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-foreground">Tên công ty:</span>
                  <div className="text-muted-foreground mt-1">
                    <div>Tiếng Việt: CÔNG TY TNHH VIET NAM STOCK EXPRESS</div>
                    <div>Tiếng nước ngoài: VIET NAM STOCK EXPRESS COMPANY LIMITED</div>
                    <div>Tên viết tắt: VNSE</div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <span className="font-semibold text-foreground">Địa chỉ trụ sở chính:</span>
                <div className="flex items-start space-x-2 text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>P.702A Tầng 7, Tòa nhà Centre Point, 106 Nguyễn Văn Trỗi, Phường Phú Nhuận, Thành phố Hồ Chí Minh, Việt Nam</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>1900 1509</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span>contact@iqx.vn</span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4">Công ty</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="font-semibold mb-4">Dịch vụ</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                  >
                    {link.title}
                    {link.href.includes('api-docs') && (
                      <ExternalLink className="h-3 w-3 ml-1" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-semibold mb-4">Nhận tin tức</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Đăng ký để nhận tin tức thị trường mới nhất
            </p>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 sm:rounded-r-none"
                />
                <Button size="sm" className="sm:rounded-l-none whitespace-nowrap">
                  <Send className="h-4 w-4 mr-2 sm:mr-0" />
                  <span className="sm:hidden">Đăng ký</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Bằng cách đăng ký, bạn đồng ý với{" "}
                <Link href="/dieu-khoan" className="underline hover:text-foreground transition-colors">
                  điều khoản sử dụng
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Social Media & Legal */}
        <div className="border-t mt-8 pt-8 flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <span className="text-sm text-muted-foreground font-medium">Theo dõi chúng tôi:</span>
            <div className="flex space-x-2">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Link href={social.href} target="_blank" rel="noopener noreferrer">
                    <social.icon className="h-4 w-4" />
                    <span className="sr-only">{social.label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
            {footerLinks.legal.map((link, index) => (
              <span key={link.href} className="flex items-center">
                <Link href={link.href} className="hover:text-foreground transition-colors whitespace-nowrap">
                  {link.title}
                </Link>
                {index < footerLinks.legal.length - 1 && (
                  <span className="hidden sm:inline ml-4 text-muted-foreground/50">•</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-8 pt-8 text-center space-y-3">
          <p className="text-sm text-muted-foreground font-medium">
            © 2025 CÔNG TY TNHH VIET NAM STOCK EXPRESS. Tất cả quyền được bảo lưu.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-4xl mx-auto">
            Dữ liệu thị trường được cung cấp bởi các sàn giao dịch chứng khoán Việt Nam.
            Thông tin chỉ mang tính chất tham khảo, không phải lời khuyên đầu tư.
            Vui lòng tham khảo ý kiến chuyên gia trước khi đưa ra quyết định đầu tư.
          </p>
        </div>
      </div>
    </footer>
  );
}
