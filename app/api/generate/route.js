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
      injuries,
    } = body;

    const prompt = `
You are an evidence-informed hybrid training coach.

Your job is to create a realistic, progressive, safe, and easy-to-follow training plan for a user who wants to combine running and strength training, or prioritize one of the two depending on their goal.

User profile:
- Goal: ${goal}
- Experience level: ${experienceLevel}
- Training days per week: ${trainingDays}
- Session duration: ${sessionDuration}
- Running experience: ${runningExperience}
- Strength training experience: ${strengthExperience}
- Injury or pain: ${injuries || "none reported"}

Instructions:
1. Build a 6- to 8-week plan depending on the complexity of the goal and the user's level.
2. Make the plan realistic for the user's available days and session duration.
3. Balance running and strength intelligently, especially lower-body fatigue.
4. Avoid unrealistic training volume or progression.
5. For beginners, keep the plan conservative and simple.
6. For intermediate and advanced users, add more structure and progression.
7. Include a weekly structure that is easy to understand and follow.
8. Make each session specific.
9. Keep the plan motivating but practical.
10. If injury or pain is mentioned, reduce impact and complexity where relevant, avoid aggressive loading, and include a short note encouraging caution and professional advice if pain persists.
11. Use simple English and avoid unnecessary jargon.

Output format:

PROFILE SUMMARY
- 3 to 5 bullet points summarizing the user profile and training context

PROGRAM OVERVIEW
- Program length
- Main focus
- Recommended weekly structure
- Main coaching priority

WEEKLY PLAN
For each week, write:
Week X
- Day name
- Session type
- Duration
- Exact session content

PROGRESSION LOGIC
- Explain briefly how the plan progresses across the weeks

RECOVERY NOTES
- Give 4 to 6 practical recovery recommendations

Important rules:
- Make the output clean and readable
- Use line breaks generously
- Do not write giant paragraphs
- Do not include medical advice
- Do not include nutrition plans
- Do not invent performance predictions
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a careful, practical, evidence-informed fitness programming assistant focused on realistic hybrid training.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.5,
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