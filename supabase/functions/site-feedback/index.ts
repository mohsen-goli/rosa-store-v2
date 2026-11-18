const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const json = (body: Record<string, unknown>, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const payload = await request.json();
    const name = String(payload.name ?? "").trim();
    const email = String(payload.email ?? "").trim();
    const message = String(payload.message ?? "").trim();
    const honeypot = String(payload.website ?? "").trim();

    // Quietly accept honeypot submissions without sending mail.
    if (honeypot) return json({ success: true });
    if (name.length < 1 || name.length > 100 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
        message.length < 5 || message.length > 3000) {
      return json({ error: "Invalid form data" }, 400);
    }

    const apiKey = Deno.env.get("RESEND_API_KEY");
    const from = Deno.env.get("RESEND_FROM_EMAIL");
    if (!apiKey || !from) {
      console.error("Missing RESEND_API_KEY or RESEND_FROM_EMAIL secret");
      return json({ error: "Email service is not configured" }, 503);
    }

    const safe = (value: string) => value.replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[char] ?? char);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: ["mohsengolzad28@gmail.com"],
        reply_to: email,
        subject: `ROSA website feedback — ${name}`,
        html: `<h2>New message from ROSA website</h2><p><b>Name:</b> ${safe(name)}</p><p><b>Email:</b> ${safe(email)}</p><p><b>Message:</b></p><p>${safe(message).replace(/\n/g, "<br>")}</p>`,
      }),
    });

    if (!response.ok) {
      console.error("Resend request failed:", await response.text());
      return json({ error: "Could not deliver email" }, 502);
    }
    return json({ success: true });
  } catch (error) {
    console.error("site-feedback error:", error);
    return json({ error: "Unexpected server error" }, 500);
  }
});
