/**
 * Cloudflare Worker - Memorial Guestbook API
 *
 * This worker provides a reliable, CORS-enabled API for storing and retrieving
 * guestbook tributes using Cloudflare KV storage.
 *
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Go to Cloudflare Dashboard > Workers & Pages > Create Worker
 * 2. Name it: memorial-guestbook-api
 * 3. Paste this code and deploy
 * 4. Go to Worker Settings > Variables > KV Namespace Bindings
 * 5. Create a KV namespace called "GUESTBOOK" and bind it as "GUESTBOOK_KV"
 * 6. Update the GUESTBOOK_API_URL in App.jsx to your worker URL
 */

const DEFAULT_ENTRIES = [
  {
    id: "welcome",
    name: "The Family",
    location: "Accra, Ghana",
    message: "We welcome all who knew and loved Grandma to share their memories here. Your words mean everything to us.",
    date: "December 2025",
    createdAt: "2025-01-01T00:00:00Z"
  }
];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

async function handleGet(env) {
  try {
    const data = await env.GUESTBOOK_KV.get("entries", { type: "json" });
    const entries = data || DEFAULT_ENTRIES;

    return new Response(JSON.stringify({ entries }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ entries: DEFAULT_ENTRIES }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
}

async function handlePost(request, env) {
  try {
    const body = await request.json();
    const { name, location, message } = body;

    if (!name || !message) {
      return new Response(JSON.stringify({ error: "Name and message are required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }

    const existingData = await env.GUESTBOOK_KV.get("entries", { type: "json" });
    const entries = existingData || DEFAULT_ENTRIES;

    const newEntry = {
      id: Date.now().toString(),
      name: name.trim(),
      location: location ? location.trim() : "Not specified",
      message: message.trim(),
      date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      createdAt: new Date().toISOString()
    };

    const welcomeEntry = entries.find(e => e.id === "welcome");
    const otherEntries = entries.filter(e => e.id !== "welcome");
    const updatedEntries = welcomeEntry
      ? [welcomeEntry, newEntry, ...otherEntries]
      : [newEntry, ...otherEntries];

    await env.GUESTBOOK_KV.put("entries", JSON.stringify(updatedEntries));

    return new Response(JSON.stringify({ success: true, entry: newEntry, entries: updatedEntries }), {
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

async function handlePut(request, env) {
  try {
    const body = await request.json();
    const entries = body.entries;

    if (!Array.isArray(entries)) {
      return new Response(JSON.stringify({ error: "Invalid data: entries must be an array" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }

    await env.GUESTBOOK_KV.put("entries", JSON.stringify(entries));

    return new Response(JSON.stringify({ success: true, entries }), {
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

export default {
  async fetch(request, env, ctx) {
    const method = request.method;

    if (method === "OPTIONS") {
      return handleOptions();
    }

    if (method === "GET") {
      return handleGet(env);
    }

    if (method === "POST") {
      return handlePost(request, env);
    }

    if (method === "PUT") {
      return handlePut(request, env);
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
};
