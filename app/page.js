"use client";

import { useState } from "react";

export default function Home() {
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function generatePlan() {
    setLoading(true);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ goal }),
    });

    const data = await res.json();
    setResult(data.plan);
    setLoading(false);
  }

  return (
    <main style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>RunLift AI</h1>

      <p>Generate your hybrid athlete training plan</p>

      <input
        placeholder="Your goal (ex: half marathon + strength)"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        style={{ padding: 10, width: 300 }}
      />

      <br />
      <br />

      <button onClick={generatePlan} style={{ padding: 10 }}>
        Generate plan
      </button>

      {loading && <p>Generating...</p>}

      {result && (
        <pre style={{ whiteSpace: "pre-wrap", marginTop: 20 }}>{result}</pre>
      )}
    </main>
  );
}