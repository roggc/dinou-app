"use client";

import { use, useState, useEffect } from "react";
import { browser } from "react-dom";

export function BrowserOnlyWidget() {
  // Native SSR opt-out in React 19.3
  // On the server (SSR), it throws a recoverable error caught by <Suspense fallback={...}>
  // On the client (hydration), it returns undefined without emitting HTML mismatch warnings
  use(browser("Accesses window, navigator, and localStorage"));

  const [savedNote, setSavedNote] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      return (
        window.localStorage.getItem("dinou_r19_note") ||
        "Note saved in localStorage via React 19.3.0!"
      );
    }
    return "";
  });

  const [screenInfo, setScreenInfo] = useState(() => ({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
    online: typeof navigator !== "undefined" ? navigator.onLine : true,
    platform: typeof navigator !== "undefined" ? navigator.platform : "N/A",
  }));

  useEffect(() => {
    const handleResize = () => {
      setScreenInfo({
        width: window.innerWidth,
        height: window.innerHeight,
        online: navigator.onLine,
        platform: navigator.platform,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSave = (val: string) => {
    setSavedNote(val);
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("dinou_r19_note", val);
    }
  };

  return (
    <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-5 text-emerald-950 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Hydrated Client (use(browser()))
          </span>
        </div>
        <span className="text-[11px] bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded-full border border-emerald-200">
          react-dom 19.3.0
        </span>
      </div>

      <p className="text-xs text-emerald-800 mb-4 leading-relaxed">
        This component uses browser-only APIs (<code>window</code>, <code>navigator</code>, <code>localStorage</code>) during its initial render without requiring defensive checks or causing <em>hydration mismatch</em> warnings.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs mb-4">
        <div className="bg-white p-2.5 rounded-xl border border-emerald-100/80 shadow-2xs">
          <span className="font-semibold text-emerald-700 block mb-1 text-[11px]">
            Window:
          </span>
          <span className="font-mono text-gray-800 font-medium">
            {screenInfo.width} × {screenInfo.height} px
          </span>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-emerald-100/80 shadow-2xs">
          <span className="font-semibold text-emerald-700 block mb-1 text-[11px]">
            Connectivity:
          </span>
          <span
            className={`font-semibold ${
              screenInfo.online ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {screenInfo.online ? "✓ Online" : "✗ Offline"}
          </span>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-emerald-100/80 shadow-2xs col-span-2 sm:col-span-1">
          <span className="font-semibold text-emerald-700 block mb-1 text-[11px]">
            Platform:
          </span>
          <span className="font-mono text-gray-700 truncate block text-[11px]">
            {screenInfo.platform}
          </span>
        </div>
      </div>

      <div>
        <label className="font-semibold text-emerald-900 block mb-1.5 text-xs">
          Persisted Data in LocalStorage:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={savedNote}
            onChange={(e) => handleSave(e.target.value)}
            className="flex-1 bg-white border border-emerald-200 rounded-xl px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="Type something here to test localStorage..."
          />
          <button
            type="button"
            onClick={() => handleSave("Note reset at " + new Date().toLocaleTimeString())}
            className="text-[11px] px-3 py-1.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 active:scale-95 transition cursor-pointer font-medium"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export function BrowserFallback() {
  return (
    <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-6 text-slate-500 flex flex-col items-center justify-center min-h-[180px] animate-pulse">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
        SSR Fallback (Server Rendered)
      </span>
      <p className="text-xs text-slate-600 text-center max-w-sm">
        <code>use(browser())</code> intercepted server-side rendering recoverably. The client will hydrate it automatically.
      </p>
    </div>
  );
}
