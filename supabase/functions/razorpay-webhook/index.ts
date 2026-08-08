import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

async function verifySignature(
  body: string,
  receivedSignature: string,
  secret: string
): Promise<boolean> {
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["verify"]
  );

  const signatureBytes = new Uint8Array(
    receivedSignature.match(/.{1,2}/g)!.map((byte) =>
      parseInt(byte, 16)
    )
  );

  return await crypto.subtle.verify(
    "HMAC",
    key,
    signatureBytes,
    encoder.encode(body)
  );
}

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405,
      });
    }

    const webhookSecret = Deno.env.get(
      "RAZORPAY_WEBHOOK_SECRET"
    );

    if (!webhookSecret) {
      console.error(
        "RAZORPAY_WEBHOOK_SECRET is missing"
      );

      return new Response("Webhook secret missing", {
        status: 500,
      });
    }

    // Read the RAW body.
    // Razorpay signature verification must use the raw body.
    const rawBody = await req.text();

    const receivedSignature = req.headers.get(
      "X-Razorpay-Signature"
    );

    console.log(
      "BODY LENGTH:",
      rawBody.length
    );

    console.log(
      "RECEIVED SIGNATURE:",
      receivedSignature
    );

    if (!receivedSignature) {
      return new Response("Missing signature", {
        status: 400,
      });
    }

    // Verify Razorpay signature
    const isValid = await verifySignature(
      rawBody,
      receivedSignature,
      webhookSecret
    );

    if (!isValid) {
      console.error(
        "Invalid Razorpay webhook signature"
      );

      return new Response("Invalid signature", {
        status: 400,
      });
    }

    console.log("Signature verified successfully");

    const event = JSON.parse(rawBody);

    console.log(
      "Razorpay event:",
      event.event
    );

    // We only process successful payment links
    if (event.event !== "payment_link.paid") {
      return new Response(
        JSON.stringify({
          received: true,
          processed: false,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const paymentLink =
      event.payload?.payment_link?.entity;

    if (!paymentLink) {
      console.error(
        "Payment link data missing"
      );

      return new Response(
        "Payment link data missing",
        {
          status: 400,
        }
      );
    }

    const paymentLinkId = paymentLink.id;
    const referenceId = paymentLink.reference_id;

    console.log(
      "Payment Link ID:",
      paymentLinkId
    );

    console.log(
      "Reference ID:",
      referenceId
    );

    if (!referenceId) {
      return new Response(
        "Reference ID missing",
        {
          status: 400,
        }
      );
    }

    // Supabase admin client
    const supabaseUrl = Deno.env.get(
      "SUPABASE_URL"
    );

    const serviceRoleKey = Deno.env.get(
      "SUPABASE_SERVICE_ROLE_KEY"
    );

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error(
        "Supabase server environment variables are missing"
      );
    }

    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey
    );

    // Find the fee using Razorpay reference_id
    const { data: fee, error: feeError } =
      await supabaseAdmin
        .from("fees")
        .select("id, status, amount")
        .eq("id", referenceId)
        .single();

    if (feeError || !fee) {
      console.error(
        "Fee not found:",
        feeError
      );

      return new Response(
        "Fee not found",
        {
          status: 404,
        }
      );
    }

    // Prevent duplicate processing
    if (fee.status === "paid") {
      console.log(
        "Fee already marked as paid"
      );

      return new Response(
        JSON.stringify({
          success: true,
          already_paid: true,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Mark fee as paid
    const { error: updateError } =
      await supabaseAdmin
        .from("fees")
        .update({
          status: "paid",
          payment_date: new Date()
            .toISOString()
            .slice(0, 10),
        })
        .eq("id", referenceId);

    if (updateError) {
      console.error(
        "Failed to update fee:",
        updateError
      );

      throw updateError;
    }

    console.log(
      `Fee ${referenceId} successfully marked as paid`
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment processed",
        fee_id: referenceId,
        payment_link_id: paymentLinkId,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(
      "Webhook error:",
      error
    );

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Webhook processing failed",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
});