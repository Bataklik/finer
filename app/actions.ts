"use server";

import { supabase } from "@/lib/supabase";
import { TransactionCategory } from "@/types";
import { revalidatePath } from "next/cache";

export async function addTransaction(formData: FormData) {
    const amount = parseFloat(formData.get("amount") as string);
    const description = formData.get("description") as string;
    const category = formData.get("category") as TransactionCategory;

    if (!amount || !description || !category) return;

    const { error } = await supabase
        .from("Transaction")
        .insert([{ id: crypto.randomUUID(), amount, description, category }]);

    if (error) {
        console.error("Fout bij toevoegen transactie:", error);
        return;
    }

    revalidatePath("/");
}

export async function deleteTransaction(id: string) {
    const { error } = await supabase.from("Transaction").delete().eq("id", id);

    if (error) {
        console.error("Fout bij verwijderen transactie:", error);
        return;
    }

    revalidatePath("/");
}
