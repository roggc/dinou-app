"use client";

export default function Page({
  query,
}: {
  query: { [key: string]: string | undefined };
}) {
  const handleNavigate = () => {
    // Navigate programmatically to a different route
    window.location.assign("/");
  };
  return (
    <div>
      <a href="/my-route/other-route?name=Roger">/my-route/other-route page</a>
      <button onClick={handleNavigate}>Go to /</button>
    </div>
  );
}
