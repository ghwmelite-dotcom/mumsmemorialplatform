/**
 * Cloudflare Worker - Memorial Candles API
 *
 * This worker provides a reliable, CORS-enabled API for storing and retrieving
 * candles data using Cloudflare KV storage.
 *
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Go to Cloudflare Dashboard > Workers & Pages > Create Worker
 * 2. Name it: memorial-candles-api
 * 3. Paste this code and deploy
 * 4. Go to Worker Settings > Variables > KV Namespace Bindings
 * 5. Create a KV namespace called "CANDLES" and bind it as "CANDLES_KV"
 * 6. Update the CANDLES_STORAGE_URL in App.jsx to your worker URL
 */

// Default candles to show initially
const DEFAULT_CANDLES = [
  { id: 1, name: "The Family", litAt: "2025-01-01T00:00:00Z" },
  { id: 2, name: "John Marion K. Hodges", litAt: "2025-01-02T00:00:00Z" },
  { id: 3, name: "Osborn M.D.K. Hodges", litAt: "2025-01-02T00:00:00Z" },
  { id: 4, name: "Ria Hodges", litAt: "2025-01-03T00:00:00Z" },
  { id: 5, name: "Gayle Hodges", litAt: "2025-01-03T00:00:00Z" },
  { id: 6, name: "With Love and Prayers", litAt: "2025-01-04T00:00:00Z" },
  { id: 7, name: "Forever Remembered", litAt: "2025-01-04T00:00:00Z" },
  { id: 8, name: "Rest In Peace", litAt: "2025-01-05T00:00:00Z" }
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

// GET - Retrieve all candles
async function handleGet(env) {
  try {
    const data = await env.CANDLES_KV.get("candles", { type: "json" });
    const candles = data || DEFAULT_CANDLES;

    return new Response(JSON.stringify({ candles }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ candles: DEFAULT_CANDLES }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
}

// PUT/POST - Save candles
async function handlePut(request, env) {
  try {
    const body = await request.json();
    const candles = body.candles;

    if (!Array.isArray(candles)) {
      return new Response(JSON.stringify({ error: "Invalid data: candles must be an array" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }

    // Save to KV storage
    await env.CANDLES_KV.put("candles", JSON.stringify(candles));

    return new Response(JSON.stringify({ success: true, candles }), {
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
