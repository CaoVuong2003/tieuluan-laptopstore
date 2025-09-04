import React, { useCallback, useState, useEffect } from "react";
import GoogleSignIn from "../../components/Buttons/GoogleSignIn";
import { Link } from "react-router-dom";
import { setLoading } from "../../store/features/common";
import { useDispatch } from "react-redux";
import { registerAPI } from "../../api/auth/authentication";
import VerifyCode from "./VerifyCode";
import { showCustomToast } from "../../components/Toaster/ShowCustomToast";
import { useTranslation } from "react-i18next";

const Register = () => {
  const { t } = useTranslation();
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    provider: "local", // nếu mặc định đăng ký qua form, không phải Google/Facebook
    enabled: false, // để backend xử lý khi xác thực email
  });

  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [enableVerify, setEnableVerify] = useState(false);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setError("");
      dispatch(setLoading(true));
      registerAPI(values)
        .then((res) => {
          if (res?.code === 200) {
            setEnableVerify(true);
            showCustomToast(res?.message + " ✅");
          }else{
            showCustomToast(res?.message || "Registration failed! ❌", "error");
          }
        })
        .catch((err) => {
          setError("Invalid or Email already exist!");
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    },
    [dispatch, values]
  );

  const handleOnChange = useCallback((e) => {
    e.persist();
    setValues((values) => ({
      ...values,
      [e.target.name]: e.target?.value,
    }));
  }, []);

  return (
    <div className="px-4 w-full">
      {!enableVerify && (
        <>
          <p className="text-3xl font-bold pb-4 pt-2">{t("auth.register")}</p>
          <GoogleSignIn />
          <p className="text-gray-500 items-center text-center w-full py-2">
            {t("auth.or")}
          </p>

          <div className="pt-2">
            <form onSubmit={onSubmit} autoComplete="off" className="overflow-y-auto custom-scroll pr-2">
              <div className="flex flex-col md:flex-row gap-4">
                {/* First Name */}
                <div className="w-full md:w-1/2">
                  <label>{t("auth.firstName")}</label>
                  <input
                    type="text"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleOnChange}
                    placeholder={t("auth.firstName")}
                    className="h-[48px] w-full border p-2 mt-2 mb-2 border-gray-400"
                    required
                    autoComplete="off"
                  />
                </div>

                {/* Last Name */}
                <div className="w-full md:w-1/2">
                  <label>{t("auth.lastName")}</label>
                  <input
                    type="text"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleOnChange}
                    placeholder={t("auth.lastName")}
                    className="h-[48px] w-full border p-2 mt-2 mb-2 border-gray-400"
                    required
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Email */}
              <label>{t("auth.email")}</label>
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleOnChange}
                placeholder={t("auth.email")}
                className="h-[48px] w-full border p-2 mt-2 mb-2 border-gray-400"
                required
                autoComplete="off"
              />

              {/* Password */}
              <label>{t("auth.password")}</label>
              <input
                type="password"
                name="password"
                value={values.password}
                onChange={handleOnChange}
                placeholder={t("auth.password")}
                className="h-[48px] w-full border p-2 mt-2 mb-2 border-gray-400"
                required
                autoComplete="new-password"
              />

              {/* Phone */}
              <label>{t("auth.phoneNumber")}</label>
              <input
                type="tel"
                name="phoneNumber"
                value={values.phoneNumber}
                onChange={handleOnChange}
                placeholder={t("auth.phoneNumber")}
                className="h-[48px] w-full border p-2 mt-2 mb-2 border-gray-400"
                required
                autoComplete="off"
              />

              {/* Address */}
              <label>{t("auth.address")}</label>
              <input
                type="text"
                name="address"
                value={values.address}
                onChange={handleOnChange}
                placeholder={t("auth.address")}
                className="h-[48px] w-full border p-2 mt-2 mb-2 border-gray-400"
                required
                autoComplete="off"
              />

              <button className="border w-full rounded-lg h-[48px] mb-2 bg-black text-white mt-4 hover:opacity-80">
                {t("auth.register")}
              </button>
            </form>
          </div>
          <Link
            to={"/auth/login"}
            className="underline text-gray-500 hover:text-black"
          >
            {t("auth.already_have_account")}
          </Link>
        </>
      )}
      {enableVerify && <VerifyCode email={values?.email} />}
    </div>
  );
};

export default Register;
