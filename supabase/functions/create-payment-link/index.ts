import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    // --------------------------------------------------
    // 1. Get environment variables
    // --------------------------------------------------

    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (
      !razorpayKeyId ||
      !razorpayKeySecret ||
      !supabaseUrl ||
      !supabaseAnonKey
    ) {
      throw new Error("Required environment variables are missing");
    }

    // --------------------------------------------------
    // 2. Get the logged-in teacher
    // --------------------------------------------------

    const authorization = req.headers.get("Authorization");

    if (!authorization) {
      return new Response(
        JSON.stringify({
          error: "Missing authorization",
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // --------------------------------------------------
    // 3. Create Supabase client using the user's session
    // --------------------------------------------------

    const supabase = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: {
            Authorization: authorization,
          },
        },
      }
    );

    // --------------------------------------------------
    // 4. Verify logged-in user
    // --------------------------------------------------

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // --------------------------------------------------
    // 5. Get fee ID from frontend
    // --------------------------------------------------

    const body = await req.json();
    const feeId = body?.fee_id;

    if (!feeId) {
      return new Response(
        JSON.stringify({
          error: "fee_id is required",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // --------------------------------------------------
    // 6. Find the teacher's fee
    // --------------------------------------------------

    const { data: fee, error: feeError } = await supabase
      .from("fees")
      .select(
        `
        id,
        teacher_id,
        student_id,
        month,
        amount,
        status
        `
      )
      .eq("id", feeId)
      .eq("teacher_id", user.id)
      .single();

    if (feeError || !fee) {
      console.error("Fee lookup error:", feeError);

      return new Response(
        JSON.stringify({
          error: "Fee not found",
        }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // --------------------------------------------------
    // 7. Don't create a link for an already paid fee
    // --------------------------------------------------

    if (fee.status === "paid") {
      return new Response(
        JSON.stringify({
          error: "This fee is already paid",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // --------------------------------------------------
    // 8. Convert ₹ amount to paise
    // --------------------------------------------------

    const amountInPaise = Math.round(Number(fee.amount) * 100);

    if (!Number.isFinite(amountInPaise) || amountInPaise <= 0) {
      throw new Error("Invalid fee amount");
    }

    // --------------------------------------------------
    // 9. Create Razorpay authentication
    // --------------------------------------------------

    const razorpayCredentials = btoa(
      `${razorpayKeyId}:${razorpayKeySecret}`
    );

    // --------------------------------------------------
    // 10. Create Razorpay Payment Link
    // --------------------------------------------------

    const razorpayResponse = await fetch(
      "https://api.razorpay.com/v1/payment_links",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${razorpayCredentials}`,
        },

        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",

          description: `ClassLedger fee - ${fee.month}`,

          reference_id: fee.id,

          expire_by:
            Math.floor(Date.now() / 1000) +
            7 * 24 * 60 * 60,

          reminder_enable: true,

          notes: {
            fee_id: fee.id,
            teacher_id: user.id,
            student_id: fee.student_id,
            month: fee.month,
          },
        }),
      }
    );

    const razorpayData = await razorpayResponse.json();

    // --------------------------------------------------
    // 11. Check Razorpay response
    // --------------------------------------------------

    if (!razorpayResponse.ok) {
      console.error("Razorpay error:", razorpayData);

      throw new Error(
        razorpayData?.error?.description ||
          "Failed to create Razorpay payment link"
      );
    }

    // --------------------------------------------------
    // 12. Save payment link in our fees table
    // --------------------------------------------------

    const { error: updateError } = await supabase
      .from("fees")
      .update({
        razorpay_payment_link_id: razorpayData.id,
        payment_link_url: razorpayData.short_url,
      })
      .eq("id", fee.id)
      .eq("teacher_id", user.id);

    if (updateError) {
      console.error("Fee update error:", updateError);

      throw new Error(
        "Payment link was created but could not be saved"
      );
    }

    // --------------------------------------------------
    // 13. Send result back to ClassLedger
    // --------------------------------------------------

    return new Response(
      JSON.stringify({
        success: true,
        payment_link_id: razorpayData.id,
        payment_link_url: razorpayData.short_url,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Create payment link error:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});