"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("toygar@demo-pflegebox.de");
    const [password, setPassword] = useState("admin1234");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        await signIn("credentials", {
            email,
            password,
            redirect: true,
            callbackUrl: "/app/dashboard",
        });
    }

    return (
        <main style={{ padding: 40 }}>
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-Mail"
                />

                <br /><br />

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Passwort"
                />

                <br /><br />

                <button type="submit">Einloggen</button>

                {error && <p>{error}</p>}
            </form>
        </main>
    );
}