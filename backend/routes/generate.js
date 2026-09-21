const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { idea } = req.body;
  if (!idea) return res.status(400).json({ error: "idea is required" });

  try {
    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b',
          response_format: { type: 'json_object' },
          messages: [
            {
              role: "user",
              content: `Come up with a product idea based on: "${idea}".
Respond with ONLY valid JSON, no other text, in this exact shape:
{"name": "...", "oneLiner": "...", "bullets": ["...", "...", "..."]}
Keep the name to 1-2 words, the one-liner under 10 words, and each bullet to 1-2 words.`,
            },
          ],
        }),
      },
    );

    const data = await groqRes.json();
    console.log("GROQ RESPONSE:", JSON.stringify(data));
    const text = data.choices[0].message.content;
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate" });
  }
});

module.exports = router;
