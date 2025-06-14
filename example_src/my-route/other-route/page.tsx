"use client";

import { Suspense } from "react";
import Counter from "./counter";

export default function Page({
  query,
}: {
  query: { [key: string]: string | undefined };
}) {
  return (
    <>
      <h1>Welcome {query.name}!</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {
          new Promise((resolve) =>
            setTimeout(() => resolve("Hello from Suspense!"), 2000)
          )
        }
      </Suspense>
      <Counter />
    </>
  );
}
