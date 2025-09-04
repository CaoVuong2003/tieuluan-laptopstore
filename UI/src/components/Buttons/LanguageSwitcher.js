import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = ({ mobile = false }) => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: "en", label: "English" },
    { code: "vi", label: "Tiếng Việt" },
  ];

  const handleChange = (lng) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`relative ${mobile ? "w-full" : "inline-block text-left"}`}
      ref={dropdownRef}
    >
      <button
        onClick={() => setOpen(!open)}
        className={`w-full px-4 py-2 border rounded-md bg-gray-50 hover:bg-gray-100 ${
          mobile ? "text-left" : ""
        }`}
      >
        🌐 {mobile ? "Chọn ngôn ngữ" : ""}
      </button>

      {open && (
        <div
          className={`absolute mt-2 bg-white border rounded shadow-lg z-50 ${
            mobile ? "w-full left-0" : "right-0 w-40"
          }`}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleChange(lang.code)}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                i18n.language === lang.code ? "font-bold text-blue-600" : ""
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
