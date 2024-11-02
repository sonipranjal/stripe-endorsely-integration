/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState } from "react";
import { useRouter } from "next/router";
import { FaRegCheckCircle } from "react-icons/fa";
import { z } from "zod";
import { api } from "@/utils/api";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export const CampaignFormSchema = z.object({
  name: z.string().min(2).max(50),
  websiteURL: z.string().url(),
  commissionType: z.enum(["percentage", "fixed"], {
    required_error: "please select type of commission.",
  }),
  payoutTerm: z
    .enum(["Net-0", "Net-15", "Net-30", "Net-60"], {
      required_error: "please select how you wanna pay your affiliates.",
    })
    .default("Net-30"),
  commissionAmount: z.coerce
    .number({
      required_error: "please enter commission amount.",
    })
    .optional(),
  commissionPercentage: z.coerce
    .number({
      required_error: "please enter commission percentage.",
    })
    .optional(),
  requireApproval: z.boolean().default(false),
  requireAdditionalDetails: z.boolean().default(false),
  additionalFieldLabel: z.string().optional(),
  affiliateDashboardText: z.string().optional(),
  welcomeMessage: z
    .string()
    .min(10, {
      message: "message must be at least 10 characters.",
    })
    .max(250, {
      message: "message must not be longer than 250 characters.",
    })
    .optional(),
});

export const affiliateOnboardingForm = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50).optional(),
  referralCode: z.string().min(2).max(20),
});

export const currenciesValuesArr = [
  "USD",
  "EUR",
  "GBP",
  "AUD",
  "CAD",
  "JPY",
  "CNY",
  "CHF",
  "SGD",
  "NZD",
  "HKD",
  "SEK",
  "NOK",
  "DKK",
  "KRW",
  "INR",
  "RUB",
  "BRL",
  "ZAR",
  "MXN",
  "PLN",
  "TRY",
] as const;

export const pricingItems = [
  {
    title: "Pro",
    period: "month",
    amount: 29,
    description: "Up to $2,500/month from affiliates",
    referrals: "Unlimited",
    cta: "Choose Pro",
    features: [
      "1 Affiliate Campaign",
      "Unlimited Referrals",
      "Unlimited Affiliates",
      "Unlimited Team Members",
      "Affiliate Portal",
      "Paypal and Wise Payouts",
      "No transaction fees",
      "Coupon code based tracking",
      "Require approval to join campaigns",
    ],
  },
  {
    title: "Advanced",
    period: "month",
    amount: 49,
    description: "Up to $7,500/month from affiliates",
    referrals: "Unlimited",
    cta: "Choose Advanced",
    features: [
      "Up to 3 Affiliate Campaigns",
      "Unlimited Referrals",
      "Unlimited Affiliates",
      "Unlimited Team Members",
      "Affiliate Portal",
      "Paypal and Wise Payouts",
      "No transaction fees",
      "Coupon code based tracking",
      "Require approval to join campaigns",
      "Advanced Commission Types",
      "Set different commissions based on Stripe product or plan",
    ],
  },
  {
    title: "Premium",
    period: "month",
    amount: 99,
    description: "Up to $20,000/month from affiliates",
    referrals: "Unlimited",
    cta: "Choose Premium",
    features: [
      "Up to 5 Affiliate Campaigns",
      "Unlimited Referrals",
      "Unlimited Affiliates",
      "Unlimited Team Members",
      "Affiliate Portal",
      "Paypal and Wise Payouts",
      "No transaction fees",
      "Coupon code based tracking",
      "Require approval to join campaigns",
      "Advanced Commission Types",
      "Set different commissions based on Stripe product or plan",
      "Set commission tiers to reward high performing affiliates",
      "Custom affiliate portal domain (ex. affiliates.yourdomain.com)",
      "Remove Powered by Endorsely branding from affiliate portal",
    ],
  },
];

export const currencies = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "AUD", label: "AUD (A$)" },
  { value: "CAD", label: "CAD (C$)" },
  { value: "JPY", label: "JPY (¥)" },
  { value: "CNY", label: "CNY (¥)" },
  { value: "CHF", label: "CHF (Fr)" },
  { value: "SGD", label: "SGD (S$)" },
  { value: "NZD", label: "NZD (NZ$)" },
  { value: "HKD", label: "HKD (HK$)" },
  { value: "SEK", label: "SEK (kr)" },
  { value: "NOK", label: "NOK (kr)" },
  { value: "DKK", label: "DKK (kr)" },
  { value: "KRW", label: "KRW (₩)" },
  { value: "INR", label: "INR (₹)" },
  { value: "RUB", label: "RUB (₽)" },
  { value: "BRL", label: "BRL (R$)" },
  { value: "ZAR", label: "ZAR (R)" },
  { value: "MXN", label: "MXN (Mex$)" },
  { value: "PLN", label: "PLN (zł)" },
  { value: "TRY", label: "TRY (₺)" },
] as const;

export const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "On Your Device" },
] as const;

export interface MagicLinkPayload {
  email: string;
  exp: number;
}

interface SubscriptionPlanType {
  name: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  features: string[];
  actionLink: string;
  actionText: string;
  isPopular?: boolean;
}

const commonFeatures = [
  "Unlimited Affiliates",
  "Unlimited Team Members",
  "Affiliate Portal",
  "Paypal and Wise Payouts",
  "No transaction fees",
  "Unlimited Referrals",
];

const subscriptionPlans: SubscriptionPlanType[] = [
  {
    name: "Free",
    description: "Get your first 3 referrals for free",
    monthlyPrice: "$0",
    yearlyPrice: "$0",
    features: ["Up to 3 Referrals", "1 Affiliate Campaign"],
    actionLink: "",
    actionText: "Start for Free",
  },
  {
    name: "Pro",
    description: "Up to $2,500/month from affiliates",
    monthlyPrice: "$29",
    yearlyPrice: "$348",
    features: [
      "1 Affiliate Campaign",
      "Coupon code based tracking",
      "Require approval to join campaigns",
    ],
    actionLink: "",
    actionText: "Choose Pro",
  },
  {
    name: "Advanced",
    description: "Up to $7,500/month from affiliates",
    monthlyPrice: "$49",
    yearlyPrice: "$588",
    features: [
      "Up to 3 Affiliate Campaigns",
      "Advanced Commission Types",
      "Set different commissions based on Stripe product or plan",
    ],
    actionLink: "",
    actionText: "Choose Advanced",
    isPopular: true,
  },
  {
    name: "Premium",
    description: "Up to $20,000/month from affiliates",
    monthlyPrice: "$99",
    yearlyPrice: "$1198",
    features: [
      "Up to 5 Affiliate Campaigns",
      "Set commission tiers to reward high performing affiliates",
      "Custom affiliate portal domain",
      "Remove Powered by Endorsely branding",
    ],
    actionLink: "",
    actionText: "Choose Premium",
  },
];

const enterprisePlan: SubscriptionPlanType = {
  name: "Enterprise",
  description: "Over $20,000/month from affiliates",
  monthlyPrice: "Custom",
  yearlyPrice: "Custom",
  features: [
    "Unlimited Affiliate Campaigns",
    "Custom integrations",
    "Dedicated account manager",
    "Set commission tiers to reward high performing affiliates",
    "Custom affiliate portal domain",
    "Remove Powered by Endorsely branding",
  ],
  actionLink: "mailto:hello@Endorsely.com",
  actionText: "Contact us",
};

type PlanType = "Monthly" | "Yearly";

const SubscriptionPlan = () => {
  const [planType, setPlanType] = useState<PlanType>("Monthly");

  const router = useRouter();

  const createSubscriptionPlanMutation = api.stripe.checkout.useMutation({
    onSuccess: (data) => {
      console.log(data.url);
      if (data.url) window.open(data.url, "_blank");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const endorsely_referral =
    typeof window !== undefined
      ? (window as any)?.endorsely_referral
      : undefined;

  console.log({ endorsely_referral });

  const getPrice = (plan: SubscriptionPlanType): string => {
    return planType === "Monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center">
        <div className="inline-flex items-center rounded-md border border-zinc-300 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
          {["Yearly", "Monthly"].map((option) => (
            <button
              key={option}
              className={cn(
                "px-4 py-2 text-sm font-medium",
                planType === option
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-white"
                  : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-700",
                option === "Yearly" && "rounded-l-md",
                option === "Monthly" && "rounded-r-md",
              )}
              onClick={() => setPlanType(option as PlanType)}
            >
              {option}
              {option === "Yearly" && (
                <span className="ml-2 rounded bg-zinc-200 px-2 py-0.5 text-xs font-semibold text-zinc-800 dark:bg-zinc-600 dark:text-zinc-200">
                  Save 25%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative flex flex-col overflow-hidden rounded-xl shadow-sm",
              plan.isPopular
                ? "border-2 border-zinc-700 dark:border-zinc-300"
                : "border border-zinc-200 dark:border-zinc-700",
            )}
          >
            {plan.isPopular && (
              <div className="absolute right-0 top-0 rounded-bl-xl bg-zinc-700 px-3 py-1 text-xs font-semibold text-white">
                Popular
              </div>
            )}
            <div className="bg-white px-6 py-8 dark:bg-zinc-800 sm:p-10 sm:pb-6">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                {plan.name}
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {plan.description}
              </p>
              <p className="mt-4">
                <span className="text-4xl font-extrabold text-zinc-900 dark:text-white">
                  {getPrice(plan)}
                </span>
                <span className="text-base font-medium text-zinc-500 dark:text-zinc-400">
                  /{planType === "Monthly" ? "mo" : "yr"}
                </span>
              </p>
            </div>
            <div className="flex flex-1 flex-col justify-between space-y-6 bg-zinc-50 px-6 pb-8 pt-6 dark:bg-zinc-900 sm:p-10 sm:pt-6">
              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <div className="flex-shrink-0">
                      <FaRegCheckCircle className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                    </div>
                    <p className="ml-3 text-sm text-zinc-700 dark:text-zinc-300">
                      {feature}
                    </p>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => {
                  createSubscriptionPlanMutation.mutate({
                    endorsely_referral,
                  });
                }}
                className={cn(
                  "w-full",
                  plan.isPopular
                    ? "bg-zinc-700 text-white hover:bg-zinc-600 dark:bg-zinc-600 dark:hover:bg-zinc-500"
                    : "bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700",
                )}
              >
                {/* <a href={plan.actionLink} className="w-full"> */}
                {plan.actionText}
                {/* </a> */}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-xl bg-zinc-100 p-8 shadow-md dark:bg-zinc-800">
        <h3 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-white">
          {enterprisePlan.name}
        </h3>
        <p className="mb-6 text-zinc-600 dark:text-zinc-300">
          {enterprisePlan.description}
        </p>
        <div className="flex items-center justify-between">
          <ul className="space-y-2">
            {enterprisePlan.features.map((feature) => (
              <li key={feature} className="flex items-center">
                <FaRegCheckCircle className="mr-2 h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
          <Button className="bg-zinc-700 text-white hover:bg-zinc-600 dark:bg-zinc-600 dark:hover:bg-zinc-500">
            <a href={enterprisePlan.actionLink} className="w-full">
              {enterprisePlan.actionText}
            </a>
          </Button>
        </div>
      </div>

      <div className="mt-12 rounded-xl bg-white p-8 shadow-md dark:bg-zinc-900">
        <h3 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-white">
          All plans include
        </h3>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {commonFeatures.map((feature) => (
            <li key={feature} className="flex items-center">
              <FaRegCheckCircle className="mr-2 h-5 w-5 text-zinc-700 dark:text-zinc-300" />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SubscriptionPlan;
