import { supabase } from "@/lib/supabase";

// Dagelijks aangeroepen door Vercel Cron (zie vercel.json), zodat het gratis
// Supabase-project niet gepauzeerd wordt na een week zonder activiteit.
export async function GET(request: Request) {
    const secret = process.env.CRON_SECRET;
    if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { error } = await supabase.from("Transaction").select("id").limit(1);

    if (error) {
        console.error("Keep-alive naar Supabase mislukt:", error);
        return Response.json({ ok: false, error: error.message }, { status: 500 });
    }

    return Response.json({ ok: true, at: new Date().toISOString() });
}
