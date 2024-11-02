import dynamic from "next/dynamic";
import React from "react";

const SubscriptionPlan = dynamic(() => import("./pricing-card"), {
  ssr: false,
});

const Subscription = () => {
  return (
    <div className="flex w-full flex-col space-y-6">
      <div className="my-10 flex w-full flex-row items-center justify-center space-y-1.5 text-center">
        <div>
          <h4 className="font-heading scroll-m-20 text-center text-xl font-medium tracking-tight">
            <span className="font-medium">{`Subscription payments test for Endorsely <> Stripe`}</span>
          </h4>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your Subscription and Billing
          </p>
        </div>
      </div>
      <div className="rounded-lg border border-gray-200 p-2.5 shadow-sm dark:border-gray-800 lg:p-6">
        <SubscriptionPlan />
      </div>
    </div>
  );
};

export default Subscription;
