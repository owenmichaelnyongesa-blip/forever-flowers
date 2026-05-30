// ============================================================
//  FOREVER FLOWERS — SUPABASE KEEP-ALIVE
//  This file prevents Supabase from pausing the project.
//  It runs automatically every 3 days via Vercel Cron.
//  No setup needed — just upload this file and vercel.json
// ============================================================

export default async function handler(req, res) {
  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/products?select=id&limit=1`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
        },
      }
    );

    if (response.ok) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] Supabase keep-alive ping successful`);
      return res.status(200).json({
        success: true,
        message: "Supabase is awake",
        timestamp,
      });
    } else {
      throw new Error(`Ping failed: ${response.status}`);
    }
  } catch (error) {
    console.error("Keep-alive error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
