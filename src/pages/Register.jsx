import React, { useState } from "react";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/users/register", form);
      alert(res.data.message);
      window.location.href = "/login";
    } catch (error) {
      alert(error.response?.data?.message || "Registrasi gagal!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-neonGreen">Register</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-lg border dark:bg-gray-700 dark:text-white"
        />
        <input
          type="email"
          name="email"
          placeholder="Email (optional)"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-lg border dark:bg-gray-700 dark:text-white"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 mb-6 rounded-lg border dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brightBlue dark:bg-neonGreen text-white dark:text-black py-3 rounded-lg font-semibold"
        >
          {loading ? "Mendaftar..." : "Register"}
        </button>
      </form>
    </div>
  );
}
