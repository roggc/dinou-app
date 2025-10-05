"use server";

import User from "@/components/user";

export default async function user() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return <User data={process.env.TEST_ENV} />;
}
