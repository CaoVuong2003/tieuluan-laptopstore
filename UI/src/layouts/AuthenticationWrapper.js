import Navigation from "../components/Navigation/Navigation";
import BckgImage from "../assets/img/bg_register.jpg";
import { useSelector } from "react-redux";
import Spinner from "../components/Spinner/Spinner";
import { useLocation, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const AuthenticationWrapper = () => {
  const location = useLocation();
  const isLoading = useSelector((state) => state?.commonState?.loading);

  return (
    <div>
      <Navigation variant="auth" />
      <div className="flex w-full h-[90vh] items-center justify-center px-4">
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-7xl">
          {/* Hình ảnh */}
          <div className="hidden md:block md:w-1/2 lg:w-2/3 p-2" >
              <img
                src={BckgImage}
                alt="gamingimage"
                className="w-full h-auto object-cover rounded-xl shadow"
              />
          </div>

          {/* Nội dung */}
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname + "-content"} // tách key riêng cho nội dung
              className="w-full md:w-1/2 lg:w-1/3 p-4"
              initial={{ scale: 0.4, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -30 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Outlet /> {/* Router sẽ render Login hoặc Register tại đây */}
            </motion.div>
          </AnimatePresence>
        </div>

        {isLoading && <Spinner />}
      </div>
    </div>
  );
};

export default AuthenticationWrapper;
