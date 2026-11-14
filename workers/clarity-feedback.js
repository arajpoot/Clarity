/**
 * Clarity feedback Worker · POST /api/feedback → email
 * Requires Cloudflare Email Routing + Email binding (SEB).
 * Educational companion feedback only — not a fatwa channel.
 */

const TO_INBOX = "expatriatefamily@gmail.com"; // e.g. your Gmail
const FROM_ON_DOMAIN = "feedback@clarity-dawah.fyi";

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders()
      });
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "POST only" }, 405);
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return json({ ok: false, error: "invalid JSON" }, 400);
    }

    const type = String(data.type || "feedback").slice(0, 40);
    const message = String(data.message || "").trim().slice(0, 4000);
    const room = String(data.room || "").slice(0, 80);
    const url = String(data.url || "").slice(0, 300);
    const when = String(data.when || new Date().toISOString()).slice(0, 40);

    if (!message || message.length < 3) {
      return json({ ok: false, error: "message required" }, 400);
    }

    const subject = `Clarity feedback · ${type}`;
    const body =
      `Type: ${type}\n` +
      `Room: ${room}\n` +
      `URL: ${url}\n` +
      `When: ${when}\n\n` +
      `${message}\n\n` +
      `— Clarity app feedback (educational only; not a fatwa)`;

    // Prefer Email binding if present
    try {
      if (env.SEB && typeof env.SEB.send === "function") {
        await env.SEB.send({
          to: TO_INBOX,
          from: FROM_ON_DOMAIN,
          subject,
          text: body
        });
        return json({ ok: true, channel: "email_binding" });
      }
    } catch (err) {
      // fall through to raw MIME via send_email if configured differently
    }

    // Cloudflare Email Workers (message API style) — adjust if your binding differs
    try {
      if (env.SEB) {
        const raw = buildRawMime({
          from: FROM_ON_DOMAIN,
          to: TO_INBOX,
          subject,
          text: body
        });
        await env.SEB.send(raw);
        return json({ ok: true, channel: "email_raw" });
      }
    } catch (err) {
      return json(
        {
          ok: false,
          error: "email_send_failed",
          detail: String(err && err.message ? err.message : err),
          hint: "Set TO_INBOX, enable Email Routing, bind Email as SEB"
        },
        500
      );
    }

    return json(
      {
        ok: false,
        error: "no_email_binding",
        hint: "Add Email binding named SEB and set TO_INBOX in the Worker"
      },
      500
    );
  }
};

function corsHeaders() {
  return {
    "access-control-allow-origin": "https://clarity-dawah.fyi",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "content-type": "application/json; charset=utf-8"
  };
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: corsHeaders()
  });
}

function buildRawMime({ from, to, subject, text }) {
  // Minimal RFC822 for bindings that accept a raw string/ReadableStream
  const lines = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "",
    text
  ];
  return lines.join("\r\n");
}
