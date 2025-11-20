"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Error al iniciar sesión");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(circle_at_bottom,_rgba(14,165,233,0.4),_transparent_60%)] blur-3xl opacity-70" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center gap-12 px-5 py-12 text-center sm:px-8 sm:py-16 lg:flex-row lg:items-center lg:gap-16 lg:text-left">
        <div className="w-full max-w-xl space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Lúmina Finance
          </div>
          <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
            Controla tus finanzas con un panel pensado para equipos modernos.
          </h1>
          <p className="text-base text-slate-300 sm:text-lg">
            Lúmina Finance es la nueva capa de inteligencia para tu dinero. Visualiza saldos, reportes y presupuestos
            en un entorno elegante y seguro.
          </p>
          <div className="grid w-full gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-left">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Equilibrio mensual</p>
              <p className="mt-2 text-2xl font-semibold text-white">$ 3.7M disponibles</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-left">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Usuarios conectados</p>
              <p className="mt-2 text-2xl font-semibold text-white">+120 equipos</p>
            </div>
          </div>
        </div>
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur sm:p-8">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Acceso seguro</p>
            <h2 className="text-2xl font-semibold text-white">Inicia sesión</h2>
            <p className="text-sm text-slate-400">Usa las credenciales configuradas para tu organización.</p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-200">
              Correo electrónico
              <input
                type="email"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="tucorreo@empresa.com"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-200">
              Contraseña
              <input
                type="password"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                placeholder="••••••••"
              />
            </label>
            {error && <p className="text-sm text-rose-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-300 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:translate-y-0.5 disabled:opacity-70"
            >
              {loading ? "Conectando..." : "Entrar en Lúmina"}
            </button>
          </form>
          <p className="mt-6 text-xs text-slate-500">Soporte 24/7 para tu equipo financiero.</p>
        </div>
      </div>
    </main>
  );
}
