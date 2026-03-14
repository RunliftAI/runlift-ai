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

    try {
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
    } catch (error) {
      setResult("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const labelStyle = {
    display: "block",
    marginBottom: 6,
    fontSize: 14,
    fontWeight: 600,
    color: "#111827",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    fontSize: 14,
    background: "white",
    boxSizing: "border-box",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: "40px 20px",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        color: "#111827",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 24,
        }}
      >
        <section
          style={{
            background: "white",
            borderRadius: 20,
            padding: 32,
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "6px 12px",
              borderRadius: 999,
              background: "#e0e7ff",
              color: "#3730a3",
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            AI HYBRID TRAINING PLANNER
          </div>

          <h1
            style={{
              fontSize: 42,
              lineHeight: 1.1,
              margin: "0 0 12px 0",
            }}
          >
            Build your running + strength plan in under 60 seconds
          </h1>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.6,
              color: "#4b5563",
              marginBottom: 28,
              maxWidth: 680,
            }}
          >
            RunLift AI creates a simple, structured hybrid training plan based
            on your goal, experience, schedule, and training background.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 12,
              marginBottom: 28,
            }}
          >
            {[
              "Built for hybrid athletes",
              "Realistic weekly structure",
              "Beginner to advanced",
            ].map((item) => (
              <div
                key={item}
                style={{
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: 14,
                  padding: 14,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {item}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <label style={labelStyle}>Goal</label>
              <input
                placeholder="ex: half marathon + strength"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={labelStyle}>Experience level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  style={inputStyle}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Training days per week</label>
                <select
                  value={trainingDays}
                  onChange={(e) => setTrainingDays(e.target.value)}
                  style={inputStyle}
                >
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={labelStyle}>Session duration</label>
                <select
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(e.target.value)}
                  style={inputStyle}
                >
                  <option value="30 min">30 min</option>
                  <option value="45 min">45 min</option>
                  <option value="60 min">60 min</option>
                  <option value="90 min">90 min</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Running experience</label>
                <select
                  value={runningExperience}
                  onChange={(e) => setRunningExperience(e.target.value)}
                  style={inputStyle}
                >
                  <option value="never ran regularly">Never ran regularly</option>
                  <option value="casual runner">Casual runner</option>
                  <option value="regular runner">Regular runner</option>
                  <option value="competitive runner">Competitive runner</option>
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Strength training experience</label>
              <select
                value={strengthExperience}
                onChange={(e) => setStrengthExperience(e.target.value)}
                style={inputStyle}
              >
                <option value="none">None</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <button
              onClick={generatePlan}
              disabled={loading}
              style={{
                marginTop: 8,
                padding: "14px 18px",
                borderRadius: 12,
                border: "none",
                background: "#111827",
                color: "white",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {loading ? "Generating..." : "Generate my plan"}
            </button>
          </div>
        </section>

        <section
          style={{
            background: "white",
            borderRadius: 20,
            padding: 28,
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            minHeight: 500,
          }}
        >
          <h2 style={{ fontSize: 22, marginTop: 0, marginBottom: 10 }}>
            Your plan
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "#6b7280",
              marginTop: 0,
              marginBottom: 20,
            }}
          >
            Your AI-generated hybrid training plan will appear here.
          </p>

                    {result ? (
            <div
              style={{
                display: "grid",
                gap: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    fontWeight: 600,
                  }}
                >
                  Generated plan
                </div>

                <button
                  onClick={generatePlan}
                  disabled={loading}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #d1d5db",
                    background: "white",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {loading ? "Generating..." : "Regenerate"}
                </button>
              </div>

              <div
                style={{
                  whiteSpace: "pre-wrap",
                  fontFamily:
                    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: 14,
                  lineHeight: 1.8,
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: 16,
                  padding: 20,
                  overflowX: "auto",
                  color: "#111827",
                }}
              >
                {result}
              </div>
            </div>
          ) : (
            <div
              style={{
                border: "1px dashed #d1d5db",
                borderRadius: 14,
                padding: 24,
                color: "#6b7280",
                background: "#f9fafb",
              }}
            >
              Fill in your profile and click <strong>Generate my plan</strong>.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}