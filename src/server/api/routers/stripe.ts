import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { Stripe } from "stripe";
import { env } from "@/env";

export const stripe = new Stripe(env.STRIPE_API_KEY, {
  typescript: true,
});

export const stripeRotuer = createTRPCRouter({
  checkout: publicProcedure
    .input(
      z.object({
        endorsely_referral: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ input: { endorsely_referral } }) => {
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: `${env.STRIPE_REDIRECT_URL}?payment-success=true`,
        cancel_url: `${env.STRIPE_REDIRECT_URL}?payment-success=false`,
        mode: "subscription",
        billing_address_collection: "auto",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Test stripe product",
                description: "lorem ipsum",
              },
              recurring: {
                interval: "month",
              },
              unit_amount: 10 * 100,
            },
            quantity: 1,
          },
        ],
        allow_promotion_codes: true,
        metadata: {
          endorsely_referral: endorsely_referral ?? "", //pass the endorsely metadata here
        },
      });

      return { url: stripeSession.url };
    }),
});
