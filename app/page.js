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
      setResult("Free limit reached. Upgrade to unlock unlimited plans.");
      return;
    }

    setLoading(true);
    setResult("");
    setCopied(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          primaryGoal,
          goalDetails,
          experienceLevel,
          trainingDays,
          sessionDuration,
          runningExperience,
          strengthExperience,
          injuries,
        }),
      });

      const data = await res.json();
      const finalResult = data.plan || data.error || "No response received.";
      setResult(finalResult);

      if (data.plan) {
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem("runlift_usage_count", String(newCount));
        if (newCount >= 3) {
          setLimitReached(true);
        }
      }
    } catch (error) {
      setResult("Something went wrong. Please try again.");
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
    } catch (error) {
      console.error("Copy failed", error);
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
          position: "fixed",
          top: 20,
          right: 20,
          background: "#111827",
          color: "white",
          padding: "8px 14px",
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 600,
          zIndex: 999,
          boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
        }}
      >
        Free plans: {usageCount}/3
      </div>

      <div
        style={{
          maxWidth: 1200,
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
              marginBottom: 22,
              maxWidth: 700,
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
              <label style={labelStyle}>Primary goal</label>
              <select
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value)}
                style={inputStyle}
              >
                <option value="hybrid athlete">Hybrid athlete</option>
                <option value="build muscle">Build muscle</option>
                <option value="fat loss">Fat loss</option>
                <option value="improve running performance">
                  Improve running performance
                </option>
                <option value="prepare for a 5k">Prepare for a 5k</option>
                <option value="prepare for a 10k">Prepare for a 10k</option>
                <option value="prepare for a half marathon">
                  Prepare for a half marathon
                </option>
                <option value="prepare for a marathon">
                  Prepare for a marathon
                </option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Goal details (optional)</label>
              <input
                placeholder="ex: keep 2 strength sessions while training for a half marathon"
                value={goalDetails}
                onChange={(e) => setGoalDetails(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
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

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
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

            <div>
              <label style={labelStyle}>Injury or pain (optional)</label>
              <input
                placeholder="ex: mild knee pain, sore Achilles, lower back discomfort"
                value={injuries}
                onChange={(e) => setInjuries(e.target.value)}
                style={inputStyle}
              />
            </div>

            <button
              onClick={generatePlan}
              disabled={loading || limitReached}
              style={{
                marginTop: 8,
                padding: "14px 18px",
                borderRadius: 12,
                border: "none",
                background: "#111827",
                color: "white",
                fontSize: 15,
                fontWeight: 700,
                cursor: loading || limitReached ? "not-allowed" : "pointer",
                opacity: loading || limitReached ? 0.75 : 1,
              }}
            >
              {loading
                ? "Generating..."
                : limitReached
                ? "Free limit reached"
                : "Generate my plan"}
            </button>
          </div>
        </section>

        <section
          style={{
            background: "white",
            borderRadius: 20,
            padding: 28,
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            minHeight: 580,
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

          {limitReached && (
            <div
              style={{
                background: "#111827",
                color: "white",
                padding: 20,
                borderRadius: 16,
                marginBottom: 20,
                textAlign: "center",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                Free limit reached
              </div>

              <div
                style={{
                  fontSize: 14,
                  marginBottom: 14,
                  opacity: 0.95,
                }}
              >
                Unlock unlimited AI training plans
              </div>

              <button
                style={{
                  background: "white",
                  color: "#111827",
                  padding: "12px 18px",
                  borderRadius: 10,
                  border: "none",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
                onClick={() => alert("Payment page coming soon")}
              >
                Unlock unlimited — 7€
              </button>
            </div>
          )}

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

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={copyPlan}
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
                    {copied ? "Copied" : "Copy plan"}
                  </button>

                  <button
                    onClick={generatePlan}
                    disabled={loading || limitReached}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1px solid #d1d5db",
                      background: "white",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor:
                        loading || limitReached ? "not-allowed" : "pointer",
                      opacity: loading || limitReached ? 0.7 : 1,
                    }}
                  >
                    {loading
                      ? "Generating..."
                      : limitReached
                      ? "Free limit reached"
                      : "Regenerate"}
                  </button>
                </div>
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