"use client";

import { useEffect } from "react";
import { patternStore } from "../pattern-store";

export default function PatternTaskUpdater({
  id,
  taskText,
}: {
  id?: string;
  taskText?: string;
}) {
  useEffect(() => {
    // 🪄 Al montarse en el cliente tras la respuesta de la Server Function,
    // actualiza el store global atómicamente.
    patternStore.incrementTasksListKey();
  }, [id, taskText]);

  return null; // Headless component: no emite DOM
}
