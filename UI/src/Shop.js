import React, { useEffect } from "react";

import HeroSection from "./components/HeroSection/HeroSection";
import CategoryBox from "./components/Sections/Categories/Category";
import Footer from "./components/Footer/Footer";
import { fetchCategories } from "./api/fetchCategories";
import { useDispatch, useSelector } from "react-redux";
import { loadCategories } from "./store/features/category";
import { setLoading } from "./store/features/common";

const Shop = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state?.categoryState?.categories || []);

  useEffect(() => {
    dispatch(setLoading(true));
    fetchCategories()
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          dispatch(loadCategories(res));
        } else {
          console.warn("Empty or invalid category response", res);
        }
      })
      .catch((err) => console.error("Fetch categories error:", err))
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Body (aside + main) */}
      <div className="flex flex-1">
        {/* Sidebar trái */}
        <aside className="w-240 bg-white shadow-md px-4 overflow-y-auto">
          {categories.map((item) => (
            <div key={item.id} className="mb-6">
              {/* Category Types */}
              {item.categoryTypes?.length > 0 && (
                <CategoryBox
                  title={`${item.name} - Loại`}
                  data={item.categoryTypes.map((type) => ({
                    title: type.name,
                    description: type.description,
                    img_category: type.imgCategory,
                    code: type.code,
                    itemType: "type",
                    parentName: item.name,
                  }))}
                />
              )}

              {/* Category Brands */}
              {item.categoryBrands?.length > 0 && (
                <CategoryBox
                  title={`${item.name} - Thương hiệu`}
                  data={item.categoryBrands.map((brand) => ({
                    title: brand.name,
                    description: brand.description,
                    img_category: brand.imgCategory,
                    code: brand.code,
                    itemType: "brand",
                    parentName: item.name,
                  }))}
                />
              )}
            </div>
          ))}
        </aside>

        {/* Nội dung chính */}
        <main className="flex-1 px-6 bg-gray-50">
          <HeroSection />

          {/* Ví dụ chỗ render các sản phẩm nổi bật */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Danh mục nổi bật</h2>
            {/* render sản phẩm... */}
          </div>
        </main>
      </div>

      {/* Footer full width */}
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default Shop;
