"use client";

import { useState, useEffect, useEffectEvent } from "react";

export function EffectEventDemo() {
  const [intervalMs, setIntervalMs] = useState(2000);
  const [currentPriority, setCurrentPriority] = useState<"Low" | "Normal" | "Critical">("Normal");
  const [logs, setLogs] = useState<Array<{ id: number; time: string; priority: string; interval: number }>>([]);
  const [timerResetCount, setTimerResetCount] = useState(0);

  // useEffectEvent reads dynamic values (like currentPriority)
  // without forcing the useEffect to tear down every time priority changes
  const onHeartbeat = useEffectEvent((activeInterval: number) => {
    const newLog = {
      id: Date.now() + Math.random(),
      time: new Date().toLocaleTimeString(),
      priority: currentPriority, // Reads latest priority reactively!
      interval: activeInterval,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 4)]);
  });

  useEffect(() => {
    // This effect ONLY restarts when intervalMs changes.
    // Changing 'currentPriority' does NOT reset the timer thanks to useEffectEvent.
    setTimerResetCount((c) => c + 1);

    const timer = setInterval(() => {
      onHeartbeat(intervalMs);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs]); // Only intervalMs as a dependency

  return (
    <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-5 text-slate-800 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-800">
            Non-Reactive Callbacks (useEffectEvent)
          </span>
        </div>
        <span className="text-[11px] bg-purple-100 text-purple-800 font-mono px-2 py-0.5 rounded-full border border-purple-200">
          react 19.3.0
        </span>
      </div>

      <p className="text-xs text-slate-600 mb-4 leading-relaxed">
        <code>useEffectEvent</code> extracts event logic so it can read the latest variables without including them in <code>useEffect</code> dependencies, avoiding unnecessary tear-down and re-subscription.
      </p>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Change priority (does not reset timer) */}
        <div className="bg-white p-3 rounded-xl border border-purple-100">
          <span className="text-xs font-semibold text-purple-900 block mb-1.5">
            Priority (read by useEffectEvent):
          </span>
          <div className="flex gap-1">
            {(["Low", "Normal", "Critical"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setCurrentPriority(p)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex-1 ${
                  currentPriority === p
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-purple-600 mt-1.5 block">
            ✓ Changing this does <strong>NOT</strong> reset the timer
          </span>
        </div>

        {/* Change interval (does reset timer) */}
        <div className="bg-white p-3 rounded-xl border border-purple-100">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-semibold text-purple-900">
              Timer Interval:
            </span>
            <span className="text-xs font-mono font-bold text-purple-700">
              {intervalMs}ms
            </span>
          </div>
          <div className="flex gap-1.5">
            {[1000, 2000, 4000].map((ms) => (
              <button
                key={ms}
                type="button"
                onClick={() => setIntervalMs(ms)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex-1 ${
                  intervalMs === ms
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {ms / 1000}s
              </button>
            ))}
          </div>
          <span className="text-[10px] text-slate-400 mt-1.5 block">
            Timer recreated: <strong>{timerResetCount} times</strong>
          </span>
        </div>
      </div>

      {/* Heartbeat Log */}
      <div className="bg-white p-3 rounded-xl border border-purple-100">
        <span className="text-xs font-semibold text-slate-700 block mb-2">
          Pings received by onHeartbeat:
        </span>
        {logs.length === 0 ? (
          <p className="text-[11px] text-slate-400 italic">Waiting for the first timer tick...</p>
        ) : (
          <div className="space-y-1.5 font-mono text-[11px]">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between bg-purple-50/50 px-2.5 py-1 rounded-md text-slate-700"
              >
                <span>{log.time}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    log.priority === "Critical"
                      ? "bg-rose-100 text-rose-700"
                      : log.priority === "Low"
                      ? "bg-slate-100 text-slate-600"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  Priority: {log.priority}
                </span>
                <span className="text-slate-400 text-[10px]">{log.interval}ms</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
