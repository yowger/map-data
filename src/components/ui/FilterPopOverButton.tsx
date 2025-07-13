import { useState, useRef } from "react"

import { useOnClickOutside } from "../../hooks/useOnClickOutside"

export default function FilterPopoverButton() {
    const [isOpen, setIsOpen] = useState(false)
    const panelRef = useRef<HTMLDivElement>(null)

    useOnClickOutside({
        ref: panelRef,
        isEnabled: isOpen,
        onClickOutside: () => setIsOpen(false),
    })

    return (
        <div className="relative inline-block">
            <button
                className="px-4 py-2 border rounded bg-white shadow-sm text-sm hover:bg-gray-100"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                Filters
            </button>

            {isOpen && (
                <div
                    ref={panelRef}
                    className="absolute right-0 mt-2 w-64 bg-white border shadow-lg rounded p-4 z-50"
                >
                    <p className="text-sm text-gray-700">filter</p>
                </div>
            )}
        </div>
    )
}
