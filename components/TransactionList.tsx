import React from "react";
import { Transaction } from "@/types";

interface TransactionListProps {
    initialTransactions: Transaction[];
}

export default function TransactionList({
    initialTransactions,
}: TransactionListProps) {
    const categoryStyles: Record<
        string,
        { label: string; dot: string; text: string }
    > = {
        NEEDS: { label: "Needs", dot: "bg-blue-500", text: "text-zinc-300" },
        WANTS: { label: "Wants", dot: "bg-purple-500", text: "text-zinc-300" },
        SAVINGS: {
            label: "Savings",
            dot: "bg-emerald-500",
            text: "text-emerald-400",
        },
        INCOME: {
            label: "Inkomst",
            dot: "bg-zinc-400",
            text: "text-emerald-400",
        },
    };

    if (!initialTransactions || initialTransactions.length === 0) {
        return (
            <div className="py-8 text-center text-xs font-mono text-zinc-600 border border-dashed border-zinc-800 rounded-xl">
                Nog geen transacties ingevoerd in de database.
            </div>
        );
    }

    return (
        <div className="divide-y divide-zinc-900/80 border-t border-b border-zinc-900">
            {initialTransactions.map((item) => {
                const style =
                    categoryStyles[item.category] || categoryStyles.NEEDS;
                const isIncome = item.category === "INCOME";
                const formattedDate = new Date(
                    item.createdAt,
                ).toLocaleDateString("nl-BE", {
                    day: "2-digit",
                    month: "short",
                });

                return (
                    <div
                        key={item.id}
                        className="flex items-center justify-between py-3.5 px-1 hover:bg-zinc-900/30 transition-colors group"
                    >
                        {/* Links: Categorie-stip & Omschrijving */}
                        <div className="flex items-center space-x-3">
                            <span
                                className={`w-1.5 h-1.5 rounded-full ${style.dot} shrink-0 opacity-80 group-hover:opacity-100 transition-opacity`}
                            />
                            <div>
                                <p className="text-sm font-medium text-zinc-200 leading-none">
                                    {item.description}
                                </p>
                                <p className="text-[11px] font-mono text-zinc-500 mt-1">
                                    {formattedDate} •{" "}
                                    <span className="text-zinc-400">
                                        {style.label}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Rechts: Bedrag */}
                        <div className="text-right font-mono text-sm tracking-tight">
                            <span
                                className={
                                    isIncome
                                        ? "text-emerald-400 font-medium"
                                        : "text-zinc-300"
                                }
                            >
                                {isIncome ? "+" : "-"} €{item.amount.toFixed(2)}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
