"use client";

export default function User({ data }: { data: string | undefined }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">User Component</h1>
      <p>This is a simple user component. {data}</p>
    </div>
  );
}
