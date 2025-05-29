
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderConfirmationRequest {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  orderDetails: {
    productName: string;
    quantity: number;
    total: string;
    size: string;
    artworkName?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customerEmail, customerName, orderNumber, orderDetails }: OrderConfirmationRequest = await req.json();

    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "LuvStickers <orders@luvstickers.com>",
      to: [customerEmail],
      subject: `Order Confirmation - ${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ea580c, #fb923c); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Order Confirmed!</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Thank you for choosing LuvStickers</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #ea580c; margin-bottom: 20px;">Hi ${customerName},</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              We've received your order and are excited to create your custom stickers! 
              Here are your order details:
            </p>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #ea580c;">
              <h3 style="margin: 0 0 15px; color: #ea580c;">Order #${orderNumber}</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Product:</td>
                  <td style="padding: 8px 0;">${orderDetails.productName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Size:</td>
                  <td style="padding: 8px 0;">${orderDetails.size}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Quantity:</td>
                  <td style="padding: 8px 0;">${orderDetails.quantity} pieces</td>
                </tr>
                ${orderDetails.artworkName ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Artwork:</td>
                  <td style="padding: 8px 0;">${orderDetails.artworkName}</td>
                </tr>
                ` : ''}
                <tr style="border-top: 2px solid #ea580c;">
                  <td style="padding: 12px 0; font-weight: bold; font-size: 18px;">Total:</td>
                  <td style="padding: 12px 0; font-weight: bold; font-size: 18px; color: #ea580c;">$${orderDetails.total}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #fef3c7; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h4 style="margin: 0 0 10px; color: #92400e;">What happens next?</h4>
              <ul style="margin: 0; padding-left: 20px; color: #92400e;">
                <li>We'll review your artwork and prepare your order</li>
                <li>Your stickers will be printed with premium materials</li>
                <li>We'll send you tracking information once shipped</li>
                <li>Most orders ship within 1-2 business days</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${Deno.env.get("SITE_URL")}/track-order?order=${orderNumber}" 
                 style="background: #ea580c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Track Your Order
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Questions? Contact us at <a href="mailto:support@luvstickers.com" style="color: #ea580c;">support@luvstickers.com</a> 
              or call 1-800-STICKERS.
            </p>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0; opacity: 0.8;">© 2024 LuvStickers. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "LuvStickers <orders@luvstickers.com>",
      to: ["admin@luvstickers.com"],
      subject: `New Order Received - ${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1f2937; padding: 20px; color: white;">
            <h1 style="margin: 0;">New Order Alert</h1>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9;">
            <h2>Order #${orderNumber}</h2>
            <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
            <p><strong>Product:</strong> ${orderDetails.productName}</p>
            <p><strong>Size:</strong> ${orderDetails.size}</p>
            <p><strong>Quantity:</strong> ${orderDetails.quantity} pieces</p>
            ${orderDetails.artworkName ? `<p><strong>Artwork:</strong> ${orderDetails.artworkName}</p>` : ''}
            <p><strong>Total:</strong> $${orderDetails.total}</p>
            
            <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 5px;">
              <p style="margin: 0; color: #92400e; font-weight: bold;">
                Action Required: Review artwork and process order
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Emails sent successfully:", { customerEmailResponse, adminEmailResponse });

    return new Response(JSON.stringify({ 
      success: true, 
      customerEmailId: customerEmailResponse.data?.id,
      adminEmailId: adminEmailResponse.data?.id 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-order-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
