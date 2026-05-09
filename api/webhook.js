// ============================================================
//  FOREVER FLOWERS — PAYSTACK WEBHOOK (Vercel Serverless)
//  This file lives in the /api folder.
//  Vercel automatically turns it into a serverless endpoint.
//  URL: https://your-site.vercel.app/api/webhook
//
//  ✏️  Set these environment variables in Vercel dashboard:
//      PAYSTACK_SECRET_KEY = sk_live_xxxx (your secret key)
//      SUPABASE_URL        = https://xxx.supabase.co
//      SUPABASE_SERVICE_KEY = your service role key
// ============================================================

const crypto = require("crypto");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // ── VERIFY PAYSTACK SIGNATURE ─────────────────────────────
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    return res.status(401).json({ message: "Invalid signature" });
  }

  const event = req.body;

  // ── HANDLE SUCCESSFUL PAYMENT ─────────────────────────────
  if (event.event === "charge.success") {
    const { reference, metadata, amount } = event.data;

    try {
      // Update order status in Supabase
      const response = await fetch(
        `${process.env.SUPABASE_URL}/rest/v1/orders?paystack_ref=eq.${reference}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "apikey": process.env.SUPABASE_SERVICE_KEY,
            "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
          },
          body: JSON.stringify({
            payment_status: "paid",
            paid_at: new Date().toISOString(),
            amount_paid: amount / 100, // Paystack uses kobo/cents
          }),
        }
      );

      if (!response.ok) {
        console.error("Failed to update order:", await response.text());
      }
    } catch (error) {
      console.error("Webhook error:", error);
    }
  }

  return res.status(200).json({ received: true });
}
