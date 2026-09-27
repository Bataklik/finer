import React from "react";
import LedgerInput from "@/components/LedgerInput";
import AllocationBar from "@/components/AllocationBar";
import TransactionList from "@/components/TransactionList";
import { supabase } from "@/lib/supabase";
import { Transaction } from "@/types";

export default async function FinancePage() {
    // Haal alle transacties op uit Supabase via HTTPS (poort 443)
    const { data, error } = await supabase
        .from("Transaction")
        .select("*")
        .order("createdAt", { ascending: false });

    if (error) {
        console.error("Fout bij ophalen transacties:", error);
    }

    // Cast data naar de gewenste Transaction types
    const transactions: Transaction[] = (data || []).map((t) => ({
        id: t.id,
        amount: Number(t.amount),
        description: t.description,
        category: t.category as Transaction["category"],
        createdAt: new Date(t.createdAt),
    }));

    // Bereken totalen uit de gefilterde data
    const income: number = transactions
        .filter((t) => t.category === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0);

    const spentNeeds: number = transactions
        .filter((t) => t.category === "NEEDS")
        .reduce((sum, t) => sum + t.amount, 0);

    const spentWants: number = transactions
        .filter((t) => t.category === "WANTS")
        .reduce((sum, t) => sum + t.amount, 0);

    const saved: number = transactions
        .filter((t) => t.category === "SAVINGS")
        .reduce((sum, t) => sum + t.amount, 0);

    const remaining: number = income - (spentNeeds + spentWants + saved);

    // Dynamische datumweergave
    const currentPeriod: string = new Date()
        .toLocaleDateString("nl-BE", {
            month: "long",
            year: "numeric",
        })
        .toUpperCase();

    return (
        <main className="max-w-2xl mx-auto px-4 py-8 sm:py-16 space-y-10">
            {/* Header: Rustig & Minimalistisch */}
            <header className="flex justify-between items-end border-b border-zinc-800/80 pb-6">
                <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                        {currentPeriod}
                    </p>
                    <h1 className="text-2xl font-light tracking-tight text-zinc-100 mt-1">
                        Persoonlijk Ledger
                    </h1>
                </div>
                <div className="text-right">
                    <p className="text-xs text-zinc-500 font-mono">
                        Resterend te besteden
                    </p>
                    <p className="text-2xl font-mono tracking-tight text-emerald-400">
                        €{remaining.toFixed(2)}
                    </p>
                </div>
            </header>

            {/* Abstracte Visualisatie: 50/30/20 Verdeelsleutel */}
            <section className="space-y-3">
                <div className="flex justify-between text-xs font-mono text-zinc-400">
                    <span>Budgetverdeling (50 / 30 / 20)</span>
                    <span>Totaal Inkomsten: €{income.toFixed(2)}</span>
                </div>

                <AllocationBar
                    income={income}
                    needs={spentNeeds}
                    wants={spentWants}
                    savings={saved}
                />

                {/* Subtiele Legende */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-xs font-mono border-t border-zinc-900">
                    <div>
                        <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                        <span className="text-zinc-400">Needs</span>
                        <p className="text-zinc-200 mt-0.5">
                            €{spentNeeds.toFixed(2)}
                        </p>
                    </div>
                    <div>
                        <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                        <span className="text-zinc-400">Wants</span>
                        <p className="text-zinc-200 mt-0.5">
                            €{spentWants.toFixed(2)}
                        </p>
                    </div>
                    <div>
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                        <span className="text-zinc-400">Savings</span>
                        <p className="text-zinc-200 mt-0.5">
                            €{saved.toFixed(2)}
                        </p>
                    </div>
                </div>
            </section>

            {/* Snel Invoerformulier */}
            <section className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-4 backdrop-blur-sm">
                <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-3">
                    Nieuwe Invoer
                </h2>
                <LedgerInput />
            </section>

            {/* Transacties Overzicht */}
            <section className="space-y-4">
                <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500">
                    Recente Mutaties
                </h2>
                <TransactionList initialTransactions={transactions} />
            </section>
        </main>
    );
}
