"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [primaryGoal, setPrimaryGoal] = useState("hybrid athlete");
  const [goalDetails, setGoalDetails] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("beginner");
  const [trainingDays, setTrainingDays] = useState("3");
  const [sessionDuration, setSessionDuration] = useState("45 min");
  const [runningExperience, setRunningExperience] = useState("casual runner");
  const [strengthExperience, setStrengthExperience] = useState("beginner");
  const [injuries, setInjuries] = useState("");

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [usageCount, setUsageCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    const saved = Number(localStorage.getItem("runlift_usage_count") || "0");
    setUsageCount(saved);
    setLimitReached(saved >= 3);
  }, []);

  async function generatePlan() {
    if (limitReached) {
      setResult("Free limit reached");
      return;
    }

    setLoading(true);
    setResult("");
    setCopied(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          primaryGoal,
          goalDetails,
          experienceLevel,
          trainingDays,
          sessionDuration,
          runningExperience,
          strengthExperience,
          injuries
        })
      });

      const data = await res.json();
      const final = data.plan || data.error || "No response";

      setResult(final);

      if (data.plan) {
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem("runlift_usage_count", String(newCount));

        if (newCount >= 3) {
          setLimitReached(true);
        }
      }
    } catch (e) {
      setResult("Error generating plan.");
    } finally {
      setLoading(false);
    }
  }

  async function copyPlan() {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: 8,
    border: "1px solid #ddd"
  };

  return (
    <main style={{ padding: 40, fontFamily: "sans-serif", maxWidth: 1000, margin: "0 auto" }}>

      <div style={{
        position: "fixed",
        top: 20,
        right: 20,
        background: "#111",
        color: "white",
        padding: "6px 12px",
        borderRadius: 8,
        fontSize: 13
      }}>
        Free plans: {usageCount}/3
      </div>

      <h1 style={{ fontSize: 40 }}>
        RunLift AI
      </h1>

      <p style={{ marginBottom: 30 }}>
        Build your running + strength training plan in seconds.
      </p>

      <div style={{ display: "grid", gap: 14, marginBottom: 30 }}>

        <select value={primaryGoal} onChange={e => setPrimaryGoal(e.target.value)} style={inputStyle}>
          <option>hybrid athlete</option>
          <option>build muscle</option>
          <option>fat loss</option>
          <option>improve running performance</option>
          <option>prepare for a 5k</option>
          <option>prepare for a 10k</option>
          <option>prepare for a half marathon</option>
          <option>prepare for a marathon</option>
        </select>

        <input
          placeholder="Goal details"
          value={goalDetails}
          onChange={e => setGoalDetails(e.target.value)}
          style={inputStyle}
        />

        <select value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)} style={inputStyle}>
          <option>beginner</option>
          <option>intermediate</option>
          <option>advanced</option>
        </select>

        <select value={trainingDays} onChange={e => setTrainingDays(e.target.value)} style={inputStyle}>
          <option>3</option>
          <option>4</option>
          <option>5</option>
          <option>6</option>
        </select>

        <select value={sessionDuration} onChange={e => setSessionDuration(e.target.value)} style={inputStyle}>
          <option>30 min</option>
          <option>45 min</option>
          <option>60 min</option>
          <option>90 min</option>
        </select>

        <input
          placeholder="Injuries or pain"
          value={injuries}
          onChange={e => setInjuries(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={generatePlan}
          disabled={loading || limitReached}
          style={{
            padding: 12,
            background: "#111",
            color: "white",
            borderRadius: 8,
            border: "none",
            fontWeight: 600
          }}
        >
          {loading ? "Generating..." : limitReached ? "Free limit reached" : "Generate plan"}
        </button>

      </div>

      {limitReached && (
        <div style={{
          background: "#111",
          color: "white",
          padding: 20,
          borderRadius: 10,
          marginBottom: 20,
          textAlign: "center"
        }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>
            Free limit reached
          </div>

          <div style={{ marginTop: 8 }}>
            Unlock unlimited AI training plans
          </div>

          <button
            style={{
              marginTop: 12,
              padding: "10px 16px",
              borderRadius: 8,
              border: "none",
              background: "white",
              fontWeight: 700
            }}
            onClick={() => alert("Payment page coming soon")}
          >
            Unlock unlimited — 7€
          </button>
        </div>
      )}

      {result && (
        <div style={{
          border: "1px solid #eee",
          padding: 20,
          borderRadius: 10,
          whiteSpace: "pre-wrap"
        }}>
          {result}

          <div style={{ marginTop: 10 }}>
            <button onClick={copyPlan}>
              {copied ? "Copied" : "Copy plan"}
            </button>
          </div>
        </div>
      )}

    </main>
  );
}