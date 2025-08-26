import React, { useState, useCallback, useEffect} from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/features/common";
import {
  forgotPasswordAPI,
  verifyOtpFPAPI,
  resendOtpAPI,
  resetPasswordAPI,
} from "../../api/authentication";
import { showCustomToast } from "../../components/Toaster/ShowCustomToast";

const ForgotPassword = () => {
  const dispatch = useDispatch();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Step 1: gửi email để nhận OTP
  const handleSendEmail = useCallback(
    (e) => {
      e.preventDefault();
      setError("");
      dispatch(setLoading(true));
      forgotPasswordAPI({ email })
        .then((res) => {
          setMessage("OTP đã được gửi tới email của bạn");
          setStep(2);
        })
        .catch(() => {
          setError("❌ Email không tồn tại");
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    },
    [dispatch, email]
  );

  // Step 2: verify OTP
  const handleVerifyOtp = useCallback(
    (e) => {
      e.preventDefault();
      setError("");
      dispatch(setLoading(true));
      verifyOtpFPAPI({ email, otp })
        .then((res) => {
          setMessage("✅ OTP chính xác, vui lòng nhập mật khẩu mới");
          setStep(3);
        })
        .catch(() => {
          setError("❌ OTP không hợp lệ hoặc đã hết hạn");
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    },
    [dispatch, email, otp]
  );

  // Step 2: resend OTP
  // Khi vào step 2 thì set cooldown (ví dụ 30s)
  useEffect(() => {
    if (step === 2) {
      setResendCooldown(60);
    }
  }, [step]);

  // Timer giảm cooldown mỗi giây
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  // Handle resend
  const handleResendOtp = useCallback(() => {
    if (resendCooldown > 0) return; // chặn spam
    setError("");
    dispatch(setLoading(true));
    resendOtpAPI({ email })
      .then((res) => {
        setMessage("🔄 OTP mới đã được gửi lại vào email");
        setResendCooldown(30); // reset cooldown sau khi gửi lại
      })
      .catch(() => {
        setError("❌ Không thể gửi lại OTP");
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch, email, resendCooldown]);

  // Step 3: reset mật khẩu
  const handleResetPassword = useCallback(
    (e) => {
      e.preventDefault();
      setError("");
      dispatch(setLoading(true));
      resetPasswordAPI({ email, newPassword })
        .then((res) => {
          setMessage("✅ Đặt lại mật khẩu thành công, hãy đăng nhập lại.");
          setStep(4);
        })
        .catch(() => {
          setError("❌ Có lỗi xảy ra, vui lòng thử lại.");
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    },
    [dispatch, email, newPassword]
  );

  useEffect(() => {
    if (message) {
      showCustomToast(message); // thông báo xanh dương
    }
    if (error) {
      showCustomToast(error)      // thông báo đỏ
    }
  }, [message, error]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Quên mật khẩu</h2>

      {step === 1 && (
        <form onSubmit={handleSendEmail}>
          <input
            type="email"
            placeholder="Nhập email"
            className="w-full border p-2 rounded mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Gửi OTP
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp}>
          <input
            type="text"
            placeholder="Nhập OTP"
            className="w-full border p-2 rounded mb-3"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mb-2"
          >
            Xác thực OTP
          </button>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendCooldown > 0}
            className={`w-full text-white py-2 rounded ${
              resendCooldown > 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {resendCooldown > 0 ? `Gửi lại OTP (${resendCooldown}s)` : "Gửi lại OTP"}
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="Mật khẩu mới"
            className="w-full border p-2 rounded mb-3"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
          >
            Đặt lại mật khẩu
          </button>
        </form>
      )}

      {step === 4 && (
        <p className="text-green-600">
          🎉 Bạn đã đổi mật khẩu thành công, vui lòng đăng nhập lại.
        </p>
      )}
    </div>
  );
};

export default ForgotPassword;
