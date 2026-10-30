import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import GuestRoute from "../components/auth/GuestRoute";
import AdminRoute from "../components/auth/AdminRoute";

const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const KnowledgePage = lazy(() => import("../pages/KnowledgePage"));
const KnowledgeDetailPage = lazy(() => import("../pages/KnowledgeDetailPage"));
const KnowledgeCreatePage = lazy(() => import("../pages/KnowledgeCreatePage"));
const KnowledgeEdit = lazy(() => import("../pages/KnowledgeEditPage"));
const MyAccount = lazy(() => import("../pages/MyAccount"));
const ExplorePage = lazy(() => import("../pages/ExplorePage"));
const ExploreDetailPage = lazy(() => import("../pages/ExploreDetailPage"));
const AdminPage = lazy(() => import("../pages/AdminPage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const FavoritesPage = lazy(() => import("../pages/FavoritesPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/explore/:id" element={<ExploreDetailPage />} />
        <Route path="/a-propos" element={<AboutPage />} />
        <Route path="/users/:id" element={<ProfilePage />} />
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/knowledge" element={<KnowledgePage />} />
          <Route path="/knowledge/:id" element={<KnowledgeDetailPage />} />
          <Route path="/knowledge/new" element={<KnowledgeCreatePage />} />
          <Route path="/account" element={<MyAccount />} />
          <Route path="/knowledge/:id/edit" element={<KnowledgeEdit />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
