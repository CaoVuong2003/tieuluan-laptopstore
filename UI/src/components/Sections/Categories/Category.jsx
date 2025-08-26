import React from "react";
import SectionHeading from "../SectionsHeading/SectionHeading";
import Card from "../../Card/Card";
import { useNavigate } from "react-router-dom";

const CategoryBox = ({ title, data }) => {
  const navigate = useNavigate();

  const normalize = (str) => str?.toLowerCase()?.trim();

  const parentToSlugMap = {
    [normalize("Laptop")]: "laptop",
    [normalize("Phụ kiện")]: "phu-kien",
    [normalize("Linh kiện")]: "linh-kien",
  };

  const handleClickCategoryType = (item) => {
    let parentSlug = "laptop";
    if (item.itemType === "type") {
      const normalizedParent = normalize(item.parentName);
      parentSlug = parentToSlugMap[normalizedParent] || "laptop";
    } else if (item.itemType === "brand") {
      parentSlug = "laptop";
    }

    navigate(`/${parentSlug}`, {
      state: {
        autoFilter: {
          filterKey: item.itemType === "type" ? "type" : "brand",
          filterValue: item.title,
        },
      },
    });
  };

  return (
    <div className="border rounded-lg bg-white shadow-sm hover:shadow-md transition mb-6">
      <SectionHeading title={title} />
      <ul>
        {data?.map((item, index) => (
          <li
            key={index}
            onClick={() => handleClickCategoryType(item)}
            className="flex items-center gap-3 p-3 sm:p-4 cursor-pointer 
                       hover:bg-gray-50 transition rounded-md"
          >
            {item?.img_category && (
              <img
                src={item.img_category}
                alt={item.title}
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain flex-shrink-0"
              />
            )}
            <span className="text-sm sm:text-base md:text-lg font-medium text-gray-700">
              {item.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryBox;