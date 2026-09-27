interface Props {
    income: number;
    needs: number;
    wants: number;
    savings: number;
}

export default function AllocationBar({
    income,
    needs,
    wants,
    savings,
}: Props) {
    const needsPct = Math.min((needs / income) * 100, 100);
    const wantsPct = Math.min((wants / income) * 100, 100);
    const savingsPct = Math.min((savings / income) * 100, 100);

    return (
        <div className="w-full bg-zinc-950 h-3 rounded-full overflow-hidden flex border border-zinc-800/80 p-px">
            <div
                style={{ width: `${needsPct}%` }}
                className="bg-blue-500 h-full rounded-l-full transition-all duration-500"
                title={`Needs: ${needsPct.toFixed(1)}%`}
            />
            <div
                style={{ width: `${wantsPct}%` }}
                className="bg-purple-500 h-full transition-all duration-500"
                title={`Wants: ${wantsPct.toFixed(1)}%`}
            />
            <div
                style={{ width: `${savingsPct}%` }}
                className="bg-emerald-500 h-full rounded-r-full transition-all duration-500"
                title={`Savings: ${savingsPct.toFixed(1)}%`}
            />
        </div>
    );
}
