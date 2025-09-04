import React from "react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-white">
      {/* Top footer */}
      <div className="pt-8">
        <div className="max-w-[1220px] mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Về GEARVN */}
            <div>
              <h4 className="text-sm font-semibold uppercase mb-3">{t("footer.about")}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/" className="hover:text-blue-500">{t("footer.intro")}</a>
                </li>
                <li>
                  <a href="/" className="hover:text-blue-500">{t("footer.recruitment")}</a>
                </li>
              </ul>
            </div>

            {/* Chính sách */}
            <div>
              <h4 className="text-sm font-semibold uppercase mb-3">{t("footer.policy")}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="hover:text-blue-500">{t("footer.warranty_policy")}</a></li>
                <li><a href="/" className="hover:text-blue-500">{t("footer.payment_policy")}</a></li>
                <li><a href="/" className="hover:text-blue-500">{t("footer.shipping_policy")}</a></li>
                <li><a href="/" className="hover:text-blue-500">{t("footer.privacy_policy")}</a></li>
              </ul>
            </div>

            {/* Thông tin */}
            <div>
              <h4 className="text-sm font-semibold uppercase mb-3">{t("footer.information")}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="hover:text-blue-500">{t("footer.store_system")}</a></li>
                <li><a href="/" className="hover:text-blue-500">{t("footer.shopping_guide")}</a></li>
                <li><a href="/" className="hover:text-blue-500">{t("footer.warranty_lookup")}</a></li>
              </ul>
            </div>

            {/* Tổng đài hỗ trợ */}
            <div>
              <h4 className="text-sm font-semibold uppercase mb-3">
                {t("footer.support_hotline")} <span className="font-normal">(8:00 - 21:00)</span>
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="inline-block w-20">{t("footer.purchase")}:</span>
                  <a href="tel:19005301" className="text-blue-600 font-semibold">1900.5301</a>
                </li>
                <li>
                  <span className="inline-block w-20">{t("footer.warranty")}:</span>
                  <a href="tel:19005325" className="text-blue-600 font-semibold">1900.5325</a>
                </li>
                <li>
                  <span className="inline-block w-20">{t("footer.complaint")}:</span>
                  <a href="tel:18006173" className="text-blue-600 font-semibold">1800.6173</a>
                  <br />
                  <span className="inline-block w-20">{t("auth.email")}:</span>
                  <a href="mailto:cskh@laptopstore.com" className="text-blue-600 font-semibold">cskh@laptopstore.com</a>
                </li>
              </ul>
            </div>

            {/* Vận chuyển & Thanh toán */}
            <div>
              <h4 className="text-sm font-semibold uppercase mb-3">{t("footer.shipping_unit")}</h4>
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

              <h4 className="text-sm font-semibold uppercase mb-3">{t("footer.payment_method")}</h4>
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
          <h4 className="text-sm font-semibold uppercase whitespace-nowrap">{t("footer.connect")}</h4>
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
