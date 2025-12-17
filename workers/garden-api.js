/**
 * Cloudflare Worker - Memorial Garden API
 *
 * This worker provides a reliable, CORS-enabled API for storing and retrieving
 * planted flowers data using Cloudflare KV storage.
 *
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Go to Cloudflare Dashboard > Workers & Pages > Create Worker
 * 2. Name it: memorial-garden-api
 * 3. Paste this code and deploy
 * 4. Go to Worker Settings > Variables > KV Namespace Bindings
 * 5. Create a KV namespace called "GARDEN" and bind it as "GARDEN_KV"
 * 6. Update the GARDEN_API_URL in App.jsx to your worker URL
 */

// Default flowers to show initially
const DEFAULT_FLOWERS = [
  { id: 1, name: "The Family", type: "rose", plantedAt: "2025-01-01T00:00:00Z" },
  { id: 2, name: "John Marion K. Hodges", type: "lily", plantedAt: "2025-01-02T00:00:00Z" },
  { id: 3, name: "Osborn M.D.K. Hodges", type: "tulip", plantedAt: "2025-01-02T00:00:00Z" },
  { id: 4, name: "Ria Hodges", type: "sunflower", plantedAt: "2025-01-03T00:00:00Z" },
  { id: 5, name: "Gayle Hodges", type: "orchid", plantedAt: "2025-01-03T00:00:00Z" },
  { id: 6, name: "With Love", type: "rose", plantedAt: "2025-01-04T00:00:00Z" },
  { id: 7, name: "Forever in Our Hearts", type: "lily", plantedAt: "2025-01-04T00:00:00Z" },
  { id: 8, name: "Rest In Peace", type: "tulip", plantedAt: "2025-01-05T00:00:00Z" }
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

// GET - Retrieve all flowers
async function handleGet(env) {
  try {
    const data = await env.GARDEN_KV.get("flowers", { type: "json" });
    const flowers = data || DEFAULT_FLOWERS;

    return new Response(JSON.stringify({ flowers }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ flowers: DEFAULT_FLOWERS }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
}

// PUT/POST - Save flowers
async function handlePut(request, env) {
  try {
    const body = await request.json();
    const flowers = body.flowers;

    if (!Array.isArray(flowers)) {
      return new Response(JSON.stringify({ error: "Invalid data: flowers must be an array" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }

    // Save to KV storage
    await env.GARDEN_KV.put("flowers", JSON.stringify(flowers));

    return new Response(JSON.stringify({ success: true, flowers }), {
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
