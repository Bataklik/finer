import React from "react";

export default function Logo({
    className = "w-7 h-7",
}: {
    className?: string;
}) {
    return (
        <svg
            viewBox="0 0 512 303"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <rect
                x="32"
                y="32"
                width="448"
                height="448"
                rx="112"
                fill="#09090b"
                stroke="#27272a"
                strokeWidth="16"
            />
            <g transform="translate(128, 128)">
                {/* Vertical Spine */}
                <rect
                    x="0"
                    y="0"
                    width="48"
                    height="256"
                    rx="24"
                    fill="#f4f4f5"
                />
                {/* Needs (50%) */}
                <rect
                    x="68"
                    y="0"
                    width="188"
                    height="48"
                    rx="24"
                    fill="#3b82f6"
                />
                {/* Wants (30%) */}
                <rect
                    x="68"
                    y="104"
                    width="124"
                    height="48"
                    rx="24"
                    fill="#a855f7"
                />
                {/* Savings (20%) */}
                <circle cx="92" cy="232" r="24" fill="#10b981" />
            </g>
        </svg>
    );
}
