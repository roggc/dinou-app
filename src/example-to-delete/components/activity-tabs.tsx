"use client";

import { Activity, useState, useEffect } from "react";

export function ActivityTabs() {
  const [activeTab, setActiveTab] = useState<"timer" | "notes">("timer");
  const [useActivityMode, setUseActivityMode] = useState(true);

  return (
    <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-5 text-slate-800 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
            Background State Preservation (&lt;Activity&gt;)
          </span>
        </div>
        <span className="text-[11px] bg-blue-100 text-blue-800 font-mono px-2 py-0.5 rounded-full border border-blue-200">
          react 19.3.0
        </span>
      </div>

      <p className="text-xs text-slate-600 mb-4 leading-relaxed">
        Compare how <code>&lt;Activity mode="hidden"&gt;</code> keeps timers running and drafted text alive in the background versus traditional conditional unmounting (<code>tab === ... && &lt;Component /&gt;</code>).
      </p>

      {/* Mode toggle: Activity vs Traditional unmount */}
      <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-blue-100 mb-4 text-xs">
        <span className="text-slate-600 font-medium">Rendering mechanism:</span>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setUseActivityMode(true)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
              useActivityMode
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            &lt;Activity&gt; (Preserves state)
          </button>
          <button
            type="button"
            onClick={() => setUseActivityMode(false)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
              !useActivityMode
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Traditional Unmount
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-blue-200/60 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab("timer")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 -mb-px transition cursor-pointer ${
            activeTab === "timer"
              ? "border-blue-600 text-blue-700 bg-white/60 rounded-t-lg"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Tab 1: Live Stopwatch
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("notes")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 -mb-px transition cursor-pointer ${
            activeTab === "notes"
              ? "border-blue-600 text-blue-700 bg-white/60 rounded-t-lg"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Tab 2: Draft Notes
        </button>
      </div>

      {/* Content Area */}
      <div className="min-h-[140px]">
        {useActivityMode ? (
          <>
            <Activity mode={activeTab === "timer" ? "visible" : "hidden"}>
              <LiveStopwatch />
            </Activity>
            <Activity mode={activeTab === "notes" ? "visible" : "hidden"}>
              <DraftNotes />
            </Activity>
          </>
        ) : (
          <>
            {activeTab === "timer" && <LiveStopwatch />}
            {activeTab === "notes" && <DraftNotes />}
          </>
        )}
      </div>
    </div>
  );
}

function LiveStopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="bg-white p-4 rounded-xl border border-blue-100/80 shadow-2xs">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-700">Continuous stopwatch:</span>
        <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
          {seconds}s elapsed
        </span>
      </div>
      <p className="text-[11px] text-slate-500 mb-3">
        Try switching to the other tab and back. With <code>&lt;Activity&gt;</code>, this counter keeps running in the background without resetting to zero.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setIsRunning((r) => !r)}
          className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer font-medium"
        >
          {isRunning ? "Pause" : "Resume"}
        </button>
        <button
          type="button"
          onClick={() => setSeconds(0)}
          className="text-xs px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg cursor-pointer font-medium"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function DraftNotes() {
  const [note, setNote] = useState("Type your thoughts here while the stopwatch is running...");

  return (
    <div className="bg-white p-4 rounded-xl border border-blue-100/80 shadow-2xs">
      <span className="text-xs font-bold text-slate-700 block mb-1">
        Textarea with local state:
      </span>
      <p className="text-[11px] text-slate-500 mb-2">
        Type any text. If you switch tabs with <code>&lt;Activity&gt;</code>, your draft will not be lost.
      </p>
      <textarea
        rows={3}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-800"
      />
    </div>
  );
}
