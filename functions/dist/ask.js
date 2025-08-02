import { onRequest } from "firebase-functions/v2/https";
export const ask = onRequest(async (req, res) => {
    const prompt = req.body?.prompt || req.query?.prompt;
    if (!prompt) {
        res.status(400).send("Missing 'prompt' parameter.");
        return;
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        res.status(500).send("Missing Gemini API key.");
        return;
    }
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
        }),
    });
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "🤷 Δεν βρήκα τίποτα.";
    res.send(text);
});
