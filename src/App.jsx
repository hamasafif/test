import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Summary from "./components/Summary";
import Reports from "./components/Reports";
import Transactions from "./pages/Transactions";
import Budget from "./pages/Budget";
import Savings from "./pages/Savings";
import Goals from "./pages/Goals";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <Summary />;
      case "transactions":
        return <Transactions />;
      case "reports":
        return <Reports />;
      case "budget":
        return <Budget />;
      case "savings":
        return <Savings />;
      case "goals":
        return <Goals />;
      default:
        return <Summary />;
    }
  };

  return (
    <div
      className="
        flex min-h-screen text-gray-800 dark:text-neonGreen transition-all duration-700
        bg-gradient-to-br from-softBlue via-lightBg to-white 
        dark:bg-none dark:bg-darkBg
      "
    >
      {/* Sidebar desktop */}
      <div className="hidden md:block">
        <Sidebar setActivePage={setActivePage} activePage={activePage} />
      </div>

      {/* Overlay + Sidebar untuk mobile */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          <Sidebar
            setActivePage={setActivePage}
            activePage={activePage}
            onClose={() => setIsSidebarOpen(false)}
          />
        </>
      )}

      {/* Konten utama */}
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
