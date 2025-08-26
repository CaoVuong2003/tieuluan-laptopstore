import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Shop from "./Shop";
import ShopApplicationWrapper from "./layouts/ShopApplicationWrapper";
import ProductListPage from "./pages/ProductListPage/ProductListPage";
import ProductDetails from "./pages/ProductDetailPage/ProductDetails";
import { loadProductBySlug } from "./routes/loader";
import AuthenticationWrapper from "./layouts/AuthenticationWrapper";
import OAuth2LoginCallback from "./pages/Auth/OAuth2LoginCallback";
import Cart from "./pages/Cart/Cart";
import Account from "./pages/Account/Account";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Checkout from "./pages/Checkout/Checkout";
import ConfirmPayment from "./pages/ConfirmPayment/ConfirmPayment";
import OrderConfirmed from "./pages/OrderConfirmed/OrderConfirmed";
import Profile from "./pages/Account/Profile";
import Orders from "./pages/Account/Orders";
import Settings from "./pages/Account/Settings";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import NotFound from "./pages/NotFound/NotFound";
import Spinner from "./components/Spinner/Spinner"; 

// ✅ lazy import ở ngoài
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const ForgotPassword = lazy(() => import("./pages/Auth/ForgotPassword"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ShopApplicationWrapper />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <Shop /> },
      { path: "/:categorySlug", element: <ProductListPage /> },
      { path: "/product/:slug", loader: loadProductBySlug, element: <ProductDetails /> },
      { path: "/cart-items", element: <Cart /> },
      {
        path: "/account-details/",
        element: (
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        ),
        children: [
          { path: "profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
          { path: "orders", element: <ProtectedRoute><Orders /></ProtectedRoute> },
          { path: "settings", element: <ProtectedRoute><Settings /></ProtectedRoute> },
        ],
      },
      { path: "/checkout", element: <ProtectedRoute><Checkout /></ProtectedRoute> },
      { path: "/orderConfirmed", element: <OrderConfirmed /> },
    ],
  },
  // ✅ Trang auth (lazy + Suspense)
  {
    path: "/auth/",
    element: <AuthenticationWrapper />,
    children: [
      {
        path: "login",
        element: (
          <Suspense fallback={<Spinner />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<Spinner />}>
            <Register />
          </Suspense>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <Suspense fallback={<Spinner />}>
            <ForgotPassword />
          </Suspense>
        ),
      },
    ],
  },
  { path: "/oauth2/callback", element: <OAuth2LoginCallback /> },
  { path: "/confirmPayment", element: <ConfirmPayment /> },
  { path: "/admin/*", element: <ProtectedRoute><AdminPanel /></ProtectedRoute> },
  { path: "*", element: <NotFound /> },
]);
