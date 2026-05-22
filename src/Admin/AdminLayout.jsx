import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "./components/Topbar";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { adminInfo } from "../Variable";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const user = adminInfo();

  useEffect(() => {
    if (!user?.auth_token || user?.role !== "admin") {
      navigate("/admin/login", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    document.body.classList.add("admin-body");
    return () => {
      document.body.classList.remove("admin-body");
    };
  }, []);

  // Synchronous security guard to block rendering child components prior to redirection
  if (!user?.auth_token || user?.role !== "admin") {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-800"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? "block" : "hidden"
          }`}
      >
        <div
          className="fixed inset-0 bg-black/30"
          onClick={() => setSidebarOpen(false)}
        ></div>
        <div className="relative flex flex-col w-64 h-full bg-[#0f1115]">
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-white/5 bg-[#0f1115]">
          <Sidebar />
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-2 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
