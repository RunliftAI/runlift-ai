import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { goal } = body;

    const prompt = `
You are an evidence-informed hybrid training coach.

Create a simple, realistic, safe, and easy-to-follow 6- to 8-week training plan for a user.

User goal:
${goal}

The output must include:
1. Profile summary
2. Program overview
3. Weekly schedule
4. Progression logic
5. Recovery notes

Keep the plan practical, readable, and motivating.
Use simple English.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful fitness programming assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const plan = completion.choices[0]?.message?.content || "No plan generated.";

    return Response.json({ plan });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Something went wrong while generating the plan." },
      { status: 500 }
    );
  }
}