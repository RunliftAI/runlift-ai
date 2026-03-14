"use client";

import { useState } from "react";

export default function Home() {
  const [goal, setGoal] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("beginner");
  const [trainingDays, setTrainingDays] = useState("3");
  const [sessionDuration, setSessionDuration] = useState("45 min");
  const [runningExperience, setRunningExperience] = useState("casual runner");
  const [strengthExperience, setStrengthExperience] = useState("beginner");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function generatePlan() {
    setLoading(true);
    setResult("");

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        goal,
        experienceLevel,
        trainingDays,
        sessionDuration,
        runningExperience,
        strengthExperience,
      }),
    });

    const data = await res.json();
    setResult(data.plan || data.error || "No response received.");
    setLoading(false);
  }

  return (
    <main style={{ padding: 40, fontFamily: "Arial", maxWidth: 800 }}>
      <h1>RunLift AI</h1>
      <p>Generate your hybrid athlete training plan</p>

      <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
        <div>
          <label>Goal</label>
          <br />
          <input
            placeholder="ex: half marathon + strength"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            style={{ padding: 10, width: "100%" }}
          />
        </div>

        <div>
          <label>Experience level</label>
          <br />
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            style={{ padding: 10, width: "100%" }}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label>Training days per week</label>
          <br />
          <select
            value={trainingDays}
            onChange={(e) => setTrainingDays(e.target.value)}
            style={{ padding: 10, width: "100%" }}
          >
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </div>

        <div>
          <label>Session duration</label>
          <br />
          <select
            value={sessionDuration}
            onChange={(e) => setSessionDuration(e.target.value)}
            style={{ padding: 10, width: "100%" }}
          >
            <option value="30 min">30 min</option>
            <option value="45 min">45 min</option>
            <option value="60 min">60 min</option>
            <option value="90 min">90 min</option>
          </select>
        </div>

        <div>
          <label>Running experience</label>
          <br />
          <select
            value={runningExperience}
            onChange={(e) => setRunningExperience(e.target.value)}
            style={{ padding: 10, width: "100%" }}
          >
            <option value="never ran regularly">Never ran regularly</option>
            <option value="casual runner">Casual runner</option>
            <option value="regular runner">Regular runner</option>
            <option value="competitive runner">Competitive runner</option>
          </select>
        </div>

        <div>
          <label>Strength training experience</label>
          <br />
          <select
            value={strengthExperience}
            onChange={(e) => setStrengthExperience(e.target.value)}
            style={{ padding: 10, width: "100%" }}
          >
            <option value="none">None</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <button onClick={generatePlan} style={{ padding: 12, marginTop: 8 }}>
          Generate plan
        </button>
      </div>

      {loading && <p style={{ marginTop: 20 }}>Generating...</p>}

      {result && (
        <pre style={{ whiteSpace: "pre-wrap", marginTop: 20 }}>{result}</pre>
      )}
    </main>
  );
}