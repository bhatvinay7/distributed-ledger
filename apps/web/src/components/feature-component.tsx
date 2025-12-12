'use client'
import React from 'react'
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Input } from "payit-ui";
import { motion } from "framer-motion";
import { Wallet, Database, Shield } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Flexible Wallets",
      icon: <Wallet className="h-6 w-6 text-blue-800" />,
      desc: "User wallets, transfers, top-ups and history."
    },
    {
      title: "Immutable Ledger",
      icon: <Database className="h-6 text-pink-400 w-6" />,
      desc: "Append-only ledger for audit reliability."
    },
    {
      title: "Security & Compliance",
      icon: <Shield className="h-6 w-6 text-yellow-300" />,
      desc: "Tokenization."
    }
  ];

  return (
    <section  className=" w-full sm:max-w-7xl mx-auto px-6 py-2  bg-white">

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {features?.map((f) => (
          < motion.div
            key={f.title}
            whileHover={{ y: -6 }}
            className=" p-6 bg-white rounded-2xl shadow-sm border"
          >
            <div className="flex items-center gap-3">
              {f.icon}
              <div className="font-semibold text-indigo-950">{f.title}</div>
            </div>
            <p className="mt-3 text-sm text-slate-600">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
