/**
 * Cloudflare Worker - Memorial Lanterns API
 *
 * This worker provides a reliable, CORS-enabled API for storing and retrieving
 * floating memorial lanterns using Cloudflare KV storage.
 *
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Go to Cloudflare Dashboard > Workers & Pages > Create Worker
 * 2. Name it: memorial-lanterns-api
 * 3. Paste this code and deploy
 * 4. Go to Worker Settings > Variables > KV Namespace Bindings
 * 5. Create a KV namespace called "LANTERNS" and bind it as "LANTERNS_KV"
 * 6. Update the LANTERNS_API_URL in App.jsx to your worker URL
 */

// Default lanterns to show initially
const DEFAULT_LANTERNS = [
  { id: 1, name: "The Family", message: "Forever in our hearts, your light guides us still.", releasedAt: "2025-01-01T00:00:00Z" },
  { id: 2, name: "John Marion K. Hodges", message: "Your love and wisdom will never be forgotten.", releasedAt: "2025-01-02T00:00:00Z" },
  { id: 3, name: "Osborn M.D.K. Hodges", message: "Rest peacefully, Grandma. We love you always.", releasedAt: "2025-01-02T00:00:00Z" },
  { id: 4, name: "Ria Hodges", message: "Your spirit shines bright in all of us.", releasedAt: "2025-01-03T00:00:00Z" },
  { id: 5, name: "Gayle Hodges", message: "Until we meet again, sweet Grandma.", releasedAt: "2025-01-03T00:00:00Z" }
];

// CORS headers for all responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

// Handle CORS preflight
function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

// GET - Retrieve all lanterns
async function handleGet(env) {
  try {
    const data = await env.LANTERNS_KV.get("lanterns", { type: "json" });
    const lanterns = data || DEFAULT_LANTERNS;

    return new Response(JSON.stringify({ lanterns }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ lanterns: DEFAULT_LANTERNS }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
}

// PUT/POST - Save lanterns
async function handlePut(request, env) {
  try {
    const body = await request.json();
    const lanterns = body.lanterns;

    if (!Array.isArray(lanterns)) {
      return new Response(JSON.stringify({ error: "Invalid data: lanterns must be an array" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }

    // Save to KV storage
    await env.LANTERNS_KV.put("lanterns", JSON.stringify(lanterns));

    return new Response(JSON.stringify({ success: true, lanterns }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
}

// Main request handler
export default {
  async fetch(request, env, ctx) {
    const method = request.method;

    // Handle CORS preflight
    if (method === "OPTIONS") {
      return handleOptions();
    }

    // Handle GET request
    if (method === "GET") {
      return handleGet(env);
    }

    // Handle PUT/POST request
    if (method === "PUT" || method === "POST") {
      return handlePut(request, env);
    }

    // Method not allowed
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
};
