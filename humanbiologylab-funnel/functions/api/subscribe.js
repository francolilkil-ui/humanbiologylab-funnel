const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 10_000;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

function clean(value, fallback) {
  const result = String(value ?? fallback).trim().slice(0, 120);
  return result || fallback;
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const contentLength = Number(request.headers.get("content-length") || 0);

    if (contentLength > MAX_BODY_BYTES) {
      return json({ error: "Request is too large." }, 413);
    }

    if (!env.DB) {
      console.error("subscribe_failed: missing DB binding");
      return json(
        { error: "Lead storage is temporarily unavailable." },
        503
      );
    }

    const payload = await request.json();
    const email = String(payload.email ?? "").trim().toLowerCase();
    const consent = payload.consent === true;
    const honeypot = String(payload.company ?? "").trim();

    // Silently accept bot submissions without storing them.
    if (honeypot) {
      return json({
        ok: true,
        guideUrl: "#starter-guide"
      });
    }

    if (!EMAIL_PATTERN.test(email) || email.length > 254) {
      return json({ error: "Enter a valid email address." }, 400);
    }

    if (!consent) {
      return json(
        {
          error:
            "Please agree to receive the guide and educational emails."
        },
        400
      );
    }

    const source = clean(payload.source, "direct");
    const medium = clean(payload.medium, "none");
    const campaign = clean(payload.campaign, "starter-guide");
    const content = clean(payload.content, "unknown");
    const placement = clean(payload.placement, "unknown");
    const now = new Date().toISOString();

    await env.DB.prepare(`
      INSERT INTO leads (
        email,
        source,
        medium,
        campaign,
        content,
        placement,
        consent,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
      ON CONFLICT(email) DO UPDATE SET
        source = excluded.source,
        medium = excluded.medium,
        campaign = excluded.campaign,
        content = excluded.content,
        placement = excluded.placement,
        consent = 1,
        updated_at = excluded.updated_at
    `)
      .bind(
        email,
        source,
        medium,
        campaign,
        content,
        placement,
        now,
        now
      )
      .run();

    return json({
      ok: true,
      guideUrl: "#starter-guide"
    });
  } catch (error) {
    console.error("subscribe_failed", error);

    return json(
      {
        error: "We couldn't save your request. Please try again."
      },
      500
    );
  }
}

export function onRequestGet() {
  return json({ error: "Method not allowed." }, 405);
}