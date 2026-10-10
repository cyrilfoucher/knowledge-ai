import Navbar from "./NavBar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { useTheme } from "../hooks/useTheme";

function MainLayout() {
  const { theme, ChangeTheme } = useTheme();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar theme={theme} onToggleTheme={ChangeTheme} />
      <Toaster theme={theme} position="top-right" richColors />
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
