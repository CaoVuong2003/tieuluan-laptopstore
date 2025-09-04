import HeroSection from "./components/HeroSection/HeroSection";
import Footer from "./components/Footer/Footer";
import AsideShop from "./components/Aside/AsideShop";
import { useTranslation } from "react-i18next";

const Shop = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Body */}
      <div className="flex flex-1">
        <AsideShop />

        <main className="flex-1 px-6 bg-gray-50">
          <HeroSection />

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("home.featuredProducts")}
            </h2>
            {/* render sản phẩm */}
          </div>
        </main>
      </div>

      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default Shop;
