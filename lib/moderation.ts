import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function moderateText(text: string) {
  const res = await openai.moderations.create({ input: text });
  const flagged = res.results[0].flagged;

  return {
    isSafe: !flagged,
    categories: res.results[0].categories,
  };
}