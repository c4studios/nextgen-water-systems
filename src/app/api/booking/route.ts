import { NextResponse } from "next/server";

/*
  Water-test booking endpoint.

  Runs on Vercel as a serverless function, which is the reason this project
  left static export. The booking form previously had no endpoint at all: submit
  composed a prefilled mailto and handed the visitor to their mail app. That
  works and it was never a dead button, but it loses people at the one step the
  whole site exists to get them through, and it gives Aaron no record of an
  enquiry that never got sent.

  Same shape as the Aqua-Safe enquiry route, deliberately: one pattern, one set
  of env vars, one thing to debug at 6pm on a Friday.

  Config via Vercel env vars (see .env.example):
    RESEND_API_KEY  — required, the secret Resend key. Never in the repo.
    BOOKING_TO      — inbox the requests land in.
    BOOKING_FROM    — verified sender, must be on a Resend-verified domain.
*/

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TO = process.env.BOOKING_TO || "hello@nextgenwatersystems.com.au";
const FROM =
  process.env.BOOKING_FROM || "Next Gen Website <bookings@nextgenwatersystems.com.au>";

type Payload = {
  name?: unknown;
  suburb?: unknown;
  phone?: unknown;
  day?: unknown;
  /** what they ticked in the site check, carried through from sessionStorage */
  taste?: unknown;
  /** honeypot — real users never see or fill this */
  company?: unknown;
};

const clean = (v: unknown, max: number): string =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Bot tripped the honeypot — accept silently, send nothing.
  if (clean(body.company, 200)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 120);
  const suburb = clean(body.suburb, 120);
  const phone = clean(body.phone, 60);
  const day = clean(body.day, 120);
  const taste = clean(body.taste, 600);

  // Only three things are actually required to call someone back. Asking for
  // more on a free-test booking costs more enquiries than it saves.
  const fields: Record<string, string> = {};
  if (!name) fields.name = "Please tell us your name.";
  if (!suburb) fields.suburb = "Which suburb are you in?";
  if (!phone) fields.phone = "A contact number lets us call you back.";
  if (Object.keys(fields).length) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", fields },
      { status: 422 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Not wired yet (local dev, or the env var is missing on the host). The
    // client falls back to the mailto compose on a non-2xx, so the visitor
    // still gets through.
    console.error("[booking] RESEND_API_KEY is not set, cannot send.");
    return NextResponse.json(
      { error: "The form isn't connected yet." },
      { status: 503 },
    );
  }

  const rows = (
    [
      ["Name", name],
      ["Phone", phone],
      ["Suburb", suburb],
      ["Preferred day", day || "Any"],
    ] as const
  ).filter(([, v]) => v);

  const subject = `Water test booking: ${name} (${suburb})`;

  const html = `<div style="font-family:'Segoe UI',system-ui,-apple-system,sans-serif;color:#12242e;line-height:1.6;max-width:560px">
    <h2 style="margin:0 0 2px;color:#0f6fb0;font-size:19px">Free water test requested</h2>
    <p style="margin:0 0 18px;color:#5a6b76;font-size:14px">Sent from the nextgenwatersystems.com.au booking form.</p>
    <table style="border-collapse:collapse;margin:0 0 18px;font-size:15px">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:5px 18px 5px 0;color:#5a6b76;vertical-align:top;white-space:nowrap">${k}</td><td style="padding:5px 0;font-weight:600">${escapeHtml(
              v,
            )}</td></tr>`,
        )
        .join("")}
    </table>
    ${
      taste
        ? `<div style="padding:14px 16px;background:#eef6fa;border-radius:12px">
      <div style="color:#5a6b76;font-size:13px;margin-bottom:6px">What they said about their water</div>
      <div style="font-size:15px">${escapeHtml(taste)}</div>
    </div>`
        : ""
    }
  </div>`;

  const text =
    `Free water test requested\n\n` +
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    (taste ? `\n\nWhat they said about their water:\n${taste}\n` : "\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to: [TO], subject, html, text }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[booking] Resend responded", res.status, detail);
      return NextResponse.json({ error: "Could not send just now." }, { status: 502 });
    }
  } catch (err) {
    console.error("[booking] send failed", err);
    return NextResponse.json({ error: "Could not send just now." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
