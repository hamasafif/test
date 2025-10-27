import React, { useState } from "react";
import ModalAlert from "../components/ModalAlert";
import { useTheme } from "../context/ThemeContext";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
  const { theme } = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Login gagal");
      const data = await res.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // 🎉 Tampilkan modal sukses
      setAlert({ show: true, message: "Login berhasil!", type: "success" });

      setTimeout(() => {
        setAlert({ show: false, message: "", type: "success" });
        window.location.href = "/dashboard";
      }, 2000);
    } catch (err) {
      // ⚠️ Tampilkan modal error
      setAlert({ show: true, message: "Login gagal, periksa username & password.", type: "error" });
      setTimeout(() => setAlert({ show: false, message: "", type: "error" }), 2500);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-all duration-700 ${
        theme === "dark" ? "bg-darkBg text-neonGreen" : "bg-gray-100 text-gray-800"
      }`}
    >
      {/* MODAL */}
      <ModalAlert
        show={alert.show}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      {/* LOGIN FORM */}
      <form
        onSubmit={handleLogin}
        className={`p-8 rounded-2xl shadow-xl w-[90%] max-w-md transition-all ${
          theme === "dark" ? "bg-darkCard border border-neonGreen/30" : "bg-white border border-gray-200"
        }`}
      >
        <h2
          className={`text-2xl font-bold mb-6 text-center ${
            theme === "dark" ? "text-neonGreen" : "text-gray-800"
          }`}
        >
          🔐 Login ke Akun Anda
        </h2>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Username</label>
          <input
            type="text"
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none ${
              theme === "dark"
                ? "bg-darkBg border-neonGreen/50 text-neonGreen focus:ring-2 focus:ring-neonGreen"
                : "border-gray-300 focus:ring-2 focus:ring-blue-400"
            }`}
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Masukkan username..."
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-1">Password</label>
          <input
            type="password"
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none ${
              theme === "dark"
                ? "bg-darkBg border-neonGreen/50 text-neonGreen focus:ring-2 focus:ring-neonGreen"
                : "border-gray-300 focus:ring-2 focus:ring-blue-400"
            }`}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Masukkan password..."
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 rounded-lg font-bold transition ${
            theme === "dark"
              ? "bg-neonGreen/20 text-neonGreen hover:bg-neonGreen/40"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Masuk
        </button>

        <p className="mt-4 text-center text-sm opacity-80">
          Belum punya akun?{" "}
          <a
            href="/register"
            className={`${theme === "dark" ? "text-neonGreen" : "text-blue-500"} font-semibold hover:underline`}
          >
            Daftar di sini
          </a>
        </p>
      </form>
    </div>
  );
}
