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
    <div className="flex flex-col min-h-screen">
      {/* Navigation fixed */}
      <Navigation className="fixed top-0 left-0 right-0 z-50" variant="auth" />

      {/* Phần dưới trừ khoảng trống nav */}
      <div className="flex w-full justify-center px-4 flex-1 pt-16">
        {/* Content Wrapper */}
        <div className="flex flex-col items-center md:flex-row w-full max-w-7xl h-full rounded-xl shadow bg-white">
          
          {/* Hình ảnh */}
          <div className="hidden md:flex md:w-1/2 lg:w-2/3 p-2 flex-shrink-0 items-center justify-center">
            <img
              src={BckgImage}
              alt="gamingimage"
              className="w-full h-auto object-cover rounded-xl"
            />
          </div>

          {/* Nội dung */}
          <div className="flex flex-1 h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname + '-content'}
                className="flex flex-col flex-1 items-center justify-center w-full p-6 h-full overflow-y-auto"
                initial={{ scale: 0.4, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: -30 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {isLoading && <Spinner />}
      </div>
    </div>
  );
};

export default AuthenticationWrapper;
