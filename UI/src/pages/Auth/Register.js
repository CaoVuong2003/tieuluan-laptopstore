import React, { useCallback, useState, useEffect } from "react";
import GoogleSignIn from "../../components/Buttons/GoogleSignIn";
import { Link } from "react-router-dom";
import { setLoading } from "../../store/features/common";
import { useDispatch } from "react-redux";
import { registerAPI } from "../../api/authentication";
import VerifyCode from "./VerifyCode";
import { showCustomToast } from "../../components/Toaster/ShowCustomToast";

const Register = () => {
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
  const [message, setMessage] = useState("");
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
            showCustomToast("Đăng ký thành công! Vui lòng kiểm tra email để xác minh 🎉");
          }else{
            showCustomToast("Đăng ký không thành công! Vui lòng thử lại. ❌");
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
    <div className="px-8 w-full">
      {!enableVerify && (
        <>
          <p className="text-3xl font-bold pb-4 pt-2">Sign Up</p>
          <GoogleSignIn />
          <p className="text-gray-500 items-center text-center w-full py-2">
            OR
          </p>

          <div className="pt-2">
            <form onSubmit={onSubmit} autoComplete="off" className="overflow-y-auto lg:h-[60vh] custom-scroll pr-2">
              <div className="flex flex-col md:flex-row gap-4">
                {/* First Name */}
                <div className="w-full md:w-1/2">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleOnChange}
                    placeholder="First Name"
                    className="h-[48px] w-full border p-2 mt-2 mb-2 border-gray-400"
                    required
                    autoComplete="off"
                  />
                </div>

                {/* Last Name */}
                <div className="w-full md:w-1/2">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleOnChange}
                    placeholder="Last Name"
                    className="h-[48px] w-full border p-2 mt-2 mb-2 border-gray-400"
                    required
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Email */}
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleOnChange}
                placeholder="Email address"
                className="h-[48px] w-full border p-2 mt-2 mb-2 border-gray-400"
                required
                autoComplete="off"
              />

              {/* Password */}
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={values.password}
                onChange={handleOnChange}
                placeholder="Password"
                className="h-[48px] w-full border p-2 mt-2 mb-2 border-gray-400"
                required
                autoComplete="new-password"
              />

              {/* Phone */}
              <label>Phone</label>
              <input
                type="tel"
                name="phoneNumber"
                value={values.phoneNumber}
                onChange={handleOnChange}
                placeholder="Phone number"
                className="h-[48px] w-full border p-2 mt-2 mb-2 border-gray-400"
                required
                autoComplete="off"
              />

              {/* Address */}
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={values.address}
                onChange={handleOnChange}
                placeholder="Your address"
                className="h-[48px] w-full border p-2 mt-2 mb-2 border-gray-400"
                required
                autoComplete="off"
              />

              <button className="border w-full rounded-lg h-[48px] mb-2 bg-black text-white mt-4 hover:opacity-80">
                Sign Up
              </button>
            </form>
          </div>
          <Link
            to={"/auth/login"}
            className="underline text-gray-500 hover:text-black"
          >
            Already have an account? Log in
          </Link>
        </>
      )}
      {enableVerify && <VerifyCode email={values?.email} />}
    </div>
  );
};

export default Register;
