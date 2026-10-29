// Een periode loopt van loondag tot de dag vóór de volgende loondag.
export const PAYDAY = 29;

export interface Period {
    key: string; // "YYYY-MM" van de maand waarin het loon binnenkomt
    start: Date; // inclusief
    end: Date; // exclusief
}

// Loondag in een maand; in februari valt die terug op de laatste dag.
function payday(year: number, month: number): Date {
    const lastDay = new Date(year, month + 1, 0).getDate();
    return new Date(year, month, Math.min(PAYDAY, lastDay));
}

function buildPeriod(year: number, month: number): Period {
    const normalized = new Date(year, month, 1);
    const y = normalized.getFullYear();
    const m = normalized.getMonth();

    return {
        key: `${y}-${String(m + 1).padStart(2, "0")}`,
        start: payday(y, m),
        end: payday(y, m + 1),
    };
}

export function periodForDate(date: Date): Period {
    const y = date.getFullYear();
    const m = date.getMonth();
    return date < payday(y, m) ? buildPeriod(y, m - 1) : buildPeriod(y, m);
}

export function periodFromKey(key: string | undefined): Period {
    const match = key?.match(/^(\d{4})-(\d{2})$/);
    if (!match) return periodForDate(new Date());

    const month = Number(match[2]) - 1;
    if (month < 0 || month > 11) return periodForDate(new Date());

    return buildPeriod(Number(match[1]), month);
}

export function shiftPeriod(period: Period, delta: number): Period {
    return buildPeriod(
        period.start.getFullYear(),
        period.start.getMonth() + delta,
    );
}
