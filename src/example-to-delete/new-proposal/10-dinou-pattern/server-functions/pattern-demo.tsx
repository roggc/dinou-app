"use server";

import type { ReactNode } from "react";
import PatternTaskUpdater from "../components/pattern-updater";
import PatternTasksList, { type PatternTaskItem } from "../components/pattern-tasks-list";

// Base de datos simulada en memoria para el caso de uso 10
export const patternTasksDb: PatternTaskItem[] = [
  { id: "1", text: "Probar Dinou Pattern con React 19", createdAt: "10:00:00" },
  { id: "2", text: "Headless Client Component Streaming", createdAt: "10:05:00" },
];

/**
 * 1. Mutación del Dinou Pattern:
 * Ejecuta la mutación en Node.js y retorna el componente Headless de cliente.
 */
export async function addPatternTask(text: string): Promise<ReactNode> {
  // Simular pequeña latencia de base de datos en Node.js (250ms)
  await new Promise((resolve) => setTimeout(resolve, 250));

  const trimmed = text.trim();
  const id = Math.random().toString(36).substring(2, 9);
  if (trimmed) {
    patternTasksDb.unshift({
      id,
      text: trimmed,
      createdAt: new Date().toLocaleTimeString(),
    });
  }

  // 🪄 El servidor orquesta el cliente retornando el updater con id único
  return <PatternTaskUpdater key={id} id={id} taskText={trimmed} />;
}

/**
 * 2. Consulta de datos:
 * Retorna las tareas renderizadas en servidor sobre Flight RPC.
 */
export async function fetchPatternTasks(): Promise<ReactNode> {
  // Simular pequeña latencia de consulta (180ms)
  await new Promise((resolve) => setTimeout(resolve, 180));

  return <PatternTasksList tasks={[...patternTasksDb]} />;
}
