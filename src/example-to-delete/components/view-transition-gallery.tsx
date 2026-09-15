"use client";

import { useState, startTransition, ViewTransition } from "react";

interface FeatureCard {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  accentColor: string;
  bgGradient: string;
  description: string;
  specs: string[];
}

const FEATURES: FeatureCard[] = [
  {
    id: "flight",
    title: "Flight IPC Streaming",
    subtitle: "Native React Server Components in Dinou v5/v6",
    badge: "RSC Engine",
    accentColor: "text-sky-600",
    bgGradient: "from-sky-500 to-blue-700",
    description:
      "Dinou connects the Express parent process with the SSR worker process via stdio[4] and createFromNodeStream(), enabling pure JSX streaming without flat JSON serialization.",
    specs: ["0kb client JS for server parts", "Progressive streaming", "Vibe-coding refactor"],
  },
  {
    id: "bundler",
    title: "Bundler Agnostic Core",
    subtitle: "Complete bundler freedom",
    badge: "Multi-Tool",
    accentColor: "text-amber-600",
    bgGradient: "from-amber-500 to-orange-600",
    description:
      "Use Esbuild (default & ultra fast), Rollup, or Webpack interchangeably for development and production with preconfigured, direct scripts.",
    specs: ["Esbuild / Rollup / Webpack", "No vendor-lockin", "100% Ejectable"],
  },
  {
    id: "encapsulation",
    title: ".dinou/ Directory",
    subtitle: "Clean root & encapsulated architecture",
    badge: "v6.0.0 Architecture",
    accentColor: "text-emerald-600",
    bgGradient: "from-emerald-500 to-teal-700",
    description:
      "All compiler manifests, client dev bundles, and static outputs live inside .dinou/ to keep the project root clean and tidy.",
    specs: [".dinou/public", ".dinou/react_client_manifest", ".dinou/dist2 & dist3"],
  },
];

export function ViewTransitionGallery() {
  const [selectedId, setSelectedId] = useState("flight");

  const handleSelect = (id: string) => {
    // startTransition tells React to coordinate the ViewTransition
    startTransition(() => {
      setSelectedId(id);
    });
  };

  const current = FEATURES.find((f) => f.id === selectedId) || FEATURES[0];

  return (
    <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 text-slate-800 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
            Native Visual Transitions (&lt;ViewTransition&gt;)
          </span>
        </div>
        <span className="text-[11px] bg-amber-100 text-amber-800 font-mono px-2 py-0.5 rounded-full border border-amber-200">
          react 19.3.0
        </span>
      </div>

      <p className="text-xs text-slate-600 mb-4 leading-relaxed">
        React 19.3 natively integrates the browser's View Transitions API. When toggling elements inside a <code>startTransition</code>, <code>&lt;ViewTransition&gt;</code> animates and morphs content smoothly.
      </p>

      {/* Item Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        {FEATURES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleSelect(item.id)}
            className={`p-3 rounded-xl text-left border transition cursor-pointer ${
              selectedId === item.id
                ? "bg-white border-amber-400 shadow-xs ring-2 ring-amber-300/50"
                : "bg-white/70 border-amber-100 hover:bg-white hover:border-amber-200"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              {item.badge}
            </span>
            <span className="text-xs font-bold text-slate-800 block truncate">
              {item.title}
            </span>
          </button>
        ))}
      </div>

      {/* ViewTransition Container */}
      <ViewTransition name="feature-card-transition">
        <div
          className={`p-5 rounded-xl bg-gradient-to-br ${current.bgGradient} text-white shadow-md transition-all duration-300`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
              {current.badge}
            </span>
            <span className="text-[11px] text-white/80 font-mono">ID: {current.id}</span>
          </div>

          <h3 className="text-base font-bold mb-1">{current.title}</h3>
          <p className="text-xs text-white/90 mb-3">{current.subtitle}</p>
          <p className="text-xs text-white/80 leading-relaxed mb-4">
            {current.description}
          </p>

          <div className="border-t border-white/20 pt-3 flex flex-wrap gap-2">
            {current.specs.map((spec, i) => (
              <span
                key={i}
                className="text-[11px] bg-black/20 px-2 py-0.5 rounded-md font-mono text-white/90"
              >
                ✓ {spec}
              </span>
            ))}
          </div>
        </div>
      </ViewTransition>
    </div>
  );
}
