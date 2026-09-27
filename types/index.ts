// Hergebruik de Prisma Enum voor je Categorieën
export type TransactionCategory = "NEEDS" | "WANTS" | "SAVINGS" | "INCOME";

// Type voor een enkele Transactie uit de Database
export interface Transaction {
    id: string;
    amount: number;
    description: string;
    category: TransactionCategory;
    createdAt: Date;
}

// Type voor Server Action Invoer
export interface CreateTransactionInput {
    amount: number;
    description: string;
    category: TransactionCategory;
}

// Props voor de visualisatie balk
export interface AllocationBarProps {
    income: number;
    needs: number;
    wants: number;
    savings: number;
}

// Props voor de transactielijst
export interface TransactionListProps {
    initialTransactions: Transaction[];
}
