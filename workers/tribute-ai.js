/**
 * Cloudflare Worker - AI Tribute Writer API
 *
 * This worker uses Claude AI to help visitors write heartfelt tributes
 * for the memorial guestbook.
 *
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Go to Cloudflare Dashboard > Workers & Pages > Create Worker
 * 2. Name it: memorial-tribute-ai
 * 3. Paste this code and deploy
 * 4. Go to Worker Settings > Variables > Environment Variables
 * 5. Add ANTHROPIC_API_KEY with your Claude API key from console.anthropic.com
 * 6. Update TRIBUTE_AI_URL in App.jsx to your worker URL
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

async function handlePost(request, env) {
  try {
    const body = await request.json();
    const { relationship, memories, specificMemory, name } = body;

    if (!relationship || !memories || memories.length === 0) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    const prompt = `You are helping someone write a heartfelt tribute message for a memorial guestbook for Grandma Josephine Worla Ameovi, a beloved Ghanaian grandmother who passed away. The tribute should be warm, respectful, and culturally appropriate for a Ghanaian Christian funeral.

The person writing the tribute:
- Relationship to Grandma: ${relationship}
- What they remember most about her: ${memories.join(", ")}
${specificMemory ? `- A specific memory they shared: ${specificMemory}` : ""}
${name ? `- Their name: ${name}` : ""}

Write a heartfelt tribute message of 2-4 sentences. The tone should be:
- Warm and personal
- Respectful and dignified
- Include a touch of Ghanaian warmth (you may include a brief Ghanaian/Ewe phrase or Christian blessing if appropriate)
- Express comfort and fond remembrance

Do not use quotation marks around the message. Just write the tribute directly.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Claude API error:", error);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    const data = await response.json();
    const tribute = data.content[0].text.trim();

    return new Response(JSON.stringify({ tribute }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
}

export default {
  async fetch(request, env, ctx) {
    const method = request.method;

    if (method === "OPTIONS") {
      return handleOptions();
    }

    if (method === "POST") {
      return handlePost(request, env);
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
};
