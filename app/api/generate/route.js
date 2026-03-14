import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      goal,
      experienceLevel,
      trainingDays,
      sessionDuration,
      runningExperience,
      strengthExperience,
    } = body;

    const prompt = `
You are an evidence-informed hybrid training coach.

Create a realistic, progressive, safe, and easy-to-follow hybrid training plan.

User profile:
- Goal: ${goal}
- Experience level: ${experienceLevel}
- Training days per week: ${trainingDays}
- Session duration: ${sessionDuration}
- Running experience: ${runningExperience}
- Strength training experience: ${strengthExperience}

Instructions:
1. Build a 6- to 8-week plan depending on the goal and level.
2. Adapt the training volume to the user's available days and session duration.
3. Balance running and strength intelligently to avoid excessive lower-body fatigue.
4. Make the plan realistic for the user's actual level.
5. Use clear weekly structure.
6. Include progression from week to week.
7. Keep the plan practical, readable, and motivating.
8. Use simple English.

Output format:
1. Profile summary
2. Program overview
3. Weekly schedule
4. Progression logic
5. Recovery notes
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful and careful fitness programming assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const plan =
      completion.choices[0]?.message?.content || "No plan generated.";

    return Response.json({ plan });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Something went wrong while generating the plan." },
      { status: 500 }
    );
  }
}