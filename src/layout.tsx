"use client";

import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>dinou app</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
