export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        neonGreen: "#39FF14",
        darkBg: "#0a0a0a",
        lightBg: "#F0F8FF", // biru muda lembut (ganti dari putih polos)
        brightBlue: "#00AEEF",
        softBlue: "#E0F2FF",
        pastelPink: "#FFE4E1",
        softYellow: "#FFFBEA",
      },
      boxShadow: {
        neon: "0 0 10px #39FF14, 0 0 20px #39FF14",
        soft: "0 2px 8px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};
