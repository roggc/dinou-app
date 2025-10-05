"use client";

import styles from "@/page.module.css";
import dinouLogo from "@/assets/dinou.png";
import Counter from "@/components/counter";
import Suspense from "react-enhanced-suspense";
import user from "@/server-functions/user";

export default function Page() {
  return (
    <div className={`text-red-500 test1 ${styles.test2} h-screen`}>
      <img src={dinouLogo} alt="Dinou Logo" className="w-32" />
      <Suspense fallback={<div>Loading user...</div>} resourceId="user">
        {user()}
      </Suspense>
      hi world!
      <Counter />
    </div>
  );
}
