const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

async function generateUpdatedArticle(originalContent, referenceContents) {
  try {
    const prompt = `
You are a professional content writer.

Update the original article to:
- Improve clarity, formatting, and readability
- Follow the structure and style of top-ranking reference articles
- Add depth where necessary
- Maintain the original meaning

Original Article:
${originalContent}

Reference Article 1:
${referenceContents[0] || ""}

Reference Article 2:
${referenceContents[1] || ""}

Please return only the updated article text.
`;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a professional content writer." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    return response.data.choices[0].message.content.trim();

  } catch (error) {
    console.error("LLM API error:", error.message);
    return originalContent; 
  }
}

module.exports = { generateUpdatedArticle };
