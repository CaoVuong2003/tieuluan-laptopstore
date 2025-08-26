import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white">
      {/* Top footer */}
      <div className="pt-8">
        <div className="max-w-[1220px] mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Về GEARVN */}
            <div>
              <h4 className="text-sm font-semibold uppercase mb-3">Về GEARVN</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/" className="hover:text-blue-500">Giới thiệu</a>
                </li>
                <li>
                  <a href="/" className="hover:text-blue-500">Tuyển dụng</a>
                </li>
              </ul>
            </div>

            {/* Chính sách */}
            <div>
              <h4 className="text-sm font-semibold uppercase mb-3">Chính sách</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="hover:text-blue-500">Chính sách bảo hành</a></li>
                <li><a href="/" className="hover:text-blue-500">Chính sách thanh toán</a></li>
                <li><a href="/" className="hover:text-blue-500">Chính sách giao hàng</a></li>
                <li><a href="/" className="hover:text-blue-500">Chính sách bảo mật</a></li>
              </ul>
            </div>

            {/* Thông tin */}
            <div>
              <h4 className="text-sm font-semibold uppercase mb-3">Thông tin</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="hover:text-blue-500">Hệ thống cửa hàng</a></li>
                <li><a href="/" className="hover:text-blue-500">Hướng dẫn mua hàng</a></li>
                <li><a href="/" className="hover:text-blue-500">Tra cứu địa chỉ bảo hành</a></li>
              </ul>
            </div>

            {/* Tổng đài hỗ trợ */}
            <div>
              <h4 className="text-sm font-semibold uppercase mb-3">
                TỔNG ĐÀI HỖ TRỢ <span className="font-normal">(8:00 - 21:00)</span>
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="inline-block w-20">Mua hàng:</span>
                  <a href="tel:19005301" className="text-blue-600 font-semibold">1900.5301</a>
                </li>
                <li>
                  <span className="inline-block w-20">Bảo hành:</span>
                  <a href="tel:19005325" className="text-blue-600 font-semibold">1900.5325</a>
                </li>
                <li>
                  <span className="inline-block w-20">Khiếu nại:</span>
                  <a href="tel:18006173" className="text-blue-600 font-semibold">1800.6173</a>
                  <br />
                  <span className="inline-block w-20">Email:</span>
                  <a href="mailto:cskh@gearvn.com" className="text-blue-600 font-semibold">cskh@gearvn.com</a>
                </li>
              </ul>
            </div>

            {/* Vận chuyển & Thanh toán */}
            <div>
              <h4 className="text-sm font-semibold uppercase mb-3">Đơn vị vận chuyển</h4>
              <ul className="grid grid-cols-4 gap-2 mb-4">
                {[1, 2, 3, 4].map(i => (
                  <li key={i}>
                    <img
                      src={`//theme.hstatic.net/200000722513/1001090675/14/ship_${i}.png?v=6222`}
                      alt={`ship-${i}`}
                      className="w-full"
                    />
                  </li>
                ))}
              </ul>

              <h4 className="text-sm font-semibold uppercase mb-3">Cách thức thanh toán</h4>
              <ul className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <li key={i}>
                    <img
                      src={`//theme.hstatic.net/200000722513/1001090675/14/pay_${i}.png?v=6222`}
                      alt={`pay-${i}`}
                      className="w-full"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 border-t border-gray-200">
        <div className="max-w-[1220px] mx-auto px-4 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h4 className="text-sm font-semibold uppercase whitespace-nowrap">Kết nối với chúng tôi</h4>
          <div className="flex items-center justify-between w-full lg:w-auto gap-4">
            <div className="flex gap-3">
              <a href="/"><img src="https://file.hstatic.net/200000636033/file/facebook_1_0e31d70174824ea184c759534430deec.png" alt="Facebook" className="h-8" /></a>
              <a href="/"><img src="https://file.hstatic.net/200000722513/file/tiktok-logo_fe1e020f470a4d679064cec31bc676e4.png" alt="Tiktok" className="h-8" /></a>
              <a href="/"><img src="https://file.hstatic.net/200000636033/file/youtube_1_d8de1f41ca614424aca55aa0c2791684.png" alt="Youtube" className="h-8" /></a>
              <a href="/"><img src="https://file.hstatic.net/200000722513/file/icon_zalo__1__f5d6f273786c4db4a3157f494019ab1e.png" alt="Zalo" className="h-8" /></a>
              <a href="/"><img src="https://file.hstatic.net/200000636033/file/group_1_54d23abd89b74ead806840aa9458661d.png" alt="Group" className="h-8" /></a>
            </div>
            <div>
              <a href="/">
                <img src="//theme.hstatic.net/200000722513/1001090675/14/logo-bct.png?v=6222" alt="BCT" className="h-12" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
