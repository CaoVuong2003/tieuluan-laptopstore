import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../api/fetch/fetchCategories";
import { loadCategories } from "../../store/features/category";
import { setLoading } from "../../store/features/common";
import { useNavigate } from "react-router-dom";

const AsideShop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categories = useSelector(
    (state) => state?.categoryState?.categories || []
  );

  useEffect(() => {
    dispatch(setLoading(true));

    Promise.all([fetchCategories()])
      .then(([resCategories]) => {
        if (Array.isArray(resCategories)) dispatch(loadCategories(resCategories));
      })
      .catch((err) => console.error("Fetch aside data error:", err))
      .finally(() => dispatch(setLoading(false)));
  }, [dispatch]);

  const handleCategoryTypeSelect = async (cat, type) => {
  
    navigate(`/${cat.code.toLowerCase()}`, {
      state: {
        autoFilter: {
          categoryId: cat.id,
          filterKey: "type",
          filterValue: type.name,
        }
      }
    });
  };

  return (
    <aside className="w-64 bg-white shadow-md px-4 overflow-y-auto">
      {/* Categories section */}
      {categories.length > 0 &&
        categories.map((cat) => (
          <div key={cat.id} className="mb-6">
            <h3 className="font-semibold mb-2">{cat.name}</h3>
            <div className="flex flex-col gap-2">
              {cat.categoryTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleCategoryTypeSelect(cat, type)}
                  className="p-2 rounded-md border text-left"
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        ))}
    </aside>
  );
};

export default AsideShop;
