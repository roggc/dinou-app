"use client";

import Counter from "./counter";
import Suspense from "react-enhanced-suspense";

export default function Page({
  query,
  data,
}: // data,
{
  query: { [key: string]: string | undefined };
  data: string;
}) {
  // const data = await new Promise<string>((r) =>
  //   setTimeout(() => r("data"), 2000)
  // );
  return (
    <>
      <h1>Hello you!{data}</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {new Promise((resolve) => setTimeout(() => resolve("Loaded"), 3000))}
      </Suspense>
      <Counter />
    </>
  );
}
