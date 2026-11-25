import React from "react";
import Link from "next/link";
import LedgerInput from "@/components/LedgerInput";
import AllocationBar from "@/components/AllocationBar";
import TransactionList from "@/components/TransactionList";
import { supabase } from "@/lib/supabase";
import { periodForDate, periodFromKey, shiftPeriod } from "@/lib/period";
import { Transaction } from "@/types";
import FinerLogo from "@/components/finer-icon";
export default async function FinancePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { periode } = await searchParams;
    const period = periodFromKey(
        typeof periode === "string" ? periode : undefined,
    );
    const currentPeriod = periodForDate(new Date());
    const previousPeriod = shiftPeriod(period, -1);
    const nextPeriod = shiftPeriod(period, 1);
    const isCurrent = period.key === currentPeriod.key;
    const hasNext = nextPeriod.start <= currentPeriod.start;

    // Haal enkel de transacties van deze loonperiode op uit Supabase via HTTPS (poort 443)
    const { data, error } = await supabase
        .from("Transaction")
        .select("*")
        .gte("createdAt", period.start.toISOString())
        .lt("createdAt", period.end.toISOString())
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

    // Dynamische periodeweergave, bv. "OKTOBER 2026" en "29 okt – 28 nov"
    const periodLabel: string = period.start
        .toLocaleDateString("nl-BE", {
            month: "long",
            year: "numeric",
        })
        .toUpperCase();

    const lastDay = new Date(period.end);
    lastDay.setDate(lastDay.getDate() - 1);
    const formatDay = (d: Date) =>
        d.toLocaleDateString("nl-BE", { day: "numeric", month: "short" });
    const periodRange = `${formatDay(period.start)} – ${formatDay(lastDay)}`;

    return (
        <main className="max-w-2xl mx-auto px-4 py-8 sm:py-16 space-y-10">
            {error && (
                <div
                    role="alert"
                    className="rounded-xl border border-red-900/80 bg-red-950/40 px-4 py-3 text-sm text-red-200"
                >
                    <p className="font-medium">Database niet bereikbaar</p>
                    <p className="mt-1 text-red-300/80">
                        De transacties konden niet geladen worden, dus de
                        bedragen hieronder kloppen niet. Controleer of het
                        Supabase-project gepauzeerd is.
                    </p>
                </div>
            )}

            {/* Header: Rustig & Minimalistisch */}
            <header className="flex justify-between items-end border-b border-zinc-800/80 pb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500">
                        <Link
                            href={`/?periode=${previousPeriod.key}`}
                            className="hover:text-zinc-200 transition-colors"
                            aria-label="Vorige periode"
                        >
                            ‹
                        </Link>
                        <span>{periodLabel}</span>
                        {hasNext ? (
                            <Link
                                href={`/?periode=${nextPeriod.key}`}
                                className="hover:text-zinc-200 transition-colors"
                                aria-label="Volgende periode"
                            >
                                ›
                            </Link>
                        ) : (
                            <span className="text-zinc-800">›</span>
                        )}
                        <span className="normal-case tracking-normal text-zinc-600">
                            {periodRange}
                        </span>
                        {!isCurrent && (
                            <Link
                                href="/"
                                className="normal-case tracking-normal text-zinc-400 hover:text-zinc-200 underline underline-offset-2"
                            >
                                naar huidige
                            </Link>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <FinerLogo />
                        <h1 className="text-2xl font-light tracking-tight text-zinc-100 mt-1">
                            Persoonlijk Ledger
                        </h1>
                    </div>
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
