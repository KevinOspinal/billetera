import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Billetera Finanzas",
  description: "Panel financiero para controlar ingresos, gastos y presupuestos",
};

const themeInitScript = `
(function() {
  try {
    var storageKey = "billetera-theme";
    var root = document.documentElement;
    var stored = window.localStorage.getItem(storageKey);
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    var initial = stored === "dark" || stored === "light" ? stored : prefersDark;
    root.classList.toggle("dark", initial === "dark");
  } catch (error) {
    console.warn("No se pudo inicializar el tema", error);
  }
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100`}
      >
        {children}
      </body>
    </html>
  );
}
