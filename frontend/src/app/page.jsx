"use client";

import { useRouter } from "next/navigation";

export default function Landing() {

  const router = useRouter();

  return (
    <div>

      <h1>FairShare</h1>

      <button onClick={() => router.push("/Login")}>
        Iniciar sesión
      </button>

      <button onClick={() => router.push("/Register")}>
        Registrarse
      </button>

    </div>
  );
}