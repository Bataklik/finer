"use client";

import { useState } from "react";
import { addTransaction } from "@/app/actions";

export default function LedgerInput() {
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<
        "NEEDS" | "WANTS" | "SAVINGS" | "INCOME"
    >("NEEDS");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !description) return;
        const formData = new FormData();
        formData.append("amount", amount);
        formData.append("description", description);
        formData.append("category", category);

        await addTransaction(formData);

        setAmount("");
        setDescription("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2"
        >
            <input
                type="number"
                step="0.01"
                placeholder="€ 0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full sm:w-28 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
            />

            <input
                type="text"
                placeholder="Omschrijving (bijv. Colruyt, Tanken, Huur...)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
            />

            <select
                value={category}
                onChange={(e) =>
                    setCategory(
                        e.target.value as
                            | "NEEDS"
                            | "WANTS"
                            | "SAVINGS"
                            | "INCOME",
                    )
                }
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-300 focus:outline-none focus:border-zinc-500"
            >
                <option value="NEEDS">Needs (50%)</option>
                <option value="WANTS">Wants (30%)</option>
                <option value="SAVINGS">Savings (20%)</option>
                <option value="INCOME">Inkomst (+)</option>
            </select>

            <button
                type="submit"
                className="bg-zinc-100 text-zinc-950 hover:bg-white font-medium px-4 py-2 rounded-lg text-xs font-mono transition-all active:scale-95"
            >
                + Voeg toe
            </button>
        </form>
    );
}
