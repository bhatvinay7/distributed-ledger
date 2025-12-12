import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from "payit-ui";
import { Check } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      title: "Starter",
      price: "₹0",
      desc: "For early-stage projects",
      features: ["Wallet & Payments", "Basic Ledger"]
    },
    {
      title: "Growth",
      price: "₹499 / mo",
      desc: "Scale with advanced features",
      features: ["Advanced Ledger", "Priority support"]
    },
    {
      title: "Enterprise",
      price: "Custom",
      desc: "Custom SLA & on-prem options",
      features: ["Dedicated ledger instances", "SSO & Compliance"]
    }
  ];

  return (
    <section  className=" w-full sm:max-w-7xl mx-auto px-6 py-12">
      <h3 className="text-2xl font-semibold text-indigo-900">Transparent pricing</h3>
      <p className="text-slate-600 mt-2 max-w-2xl">
        Pay-as-you-grow pricing and enterprise plans.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.title}>
            <CardHeader>
              <CardTitle className="text-black">{plan.title}</CardTitle>
              <CardDescription className="text-indigo-800">{plan.desc}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold text-black">{plan.price}</div>

              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2">
                    <Check className="h-4 w-4" /> {feat}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <Button>Choose plan</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
