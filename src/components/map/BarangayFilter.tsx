import PopOver from "../ui/PopOver"

type BarangayFilterDropdownProps = {
    selected: string[]
    onChange: (selected: string[]) => void
    barangays: { id: string; name: string }[]
    onClear?: () => void
    onDone?: () => void
}

export function BarangayFilterDropdown({
    selected,
    onChange,
    barangays,
    onClear,
    onDone,
}: BarangayFilterDropdownProps) {
    const toggleBarangay = (id: string) => {
        onChange(
            selected.includes(id)
                ? selected.filter((b) => b !== id)
                : [...selected, id]
        )
    }

    return (
        <PopOver>
            <PopOver.Trigger>
                <button className="px-3.5 py-1.5 bg-gray-200 rounded-md text-sm font-medium text-nowrap text-gray-700 cursor-pointer hover:bg-gray-300">
                    <span className="mr-1.5">
                        {selected.length > 0 && `${selected.length}`} Barangay
                    </span>
                    <i className="fa-solid fa-caret-down" />
                </button>
            </PopOver.Trigger>

            <PopOver.Content>
                <div className="py-3 flex flex-col space-y-4 w-56 max-h-64 overflow-auto shadow-md">
                    <div className="px-4">
                        <div className="flex flex-col gap-1">
                            {barangays.map((b) => (
                                <label
                                    key={b.id}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        value={b.id}
                                        checked={selected.includes(b.id)}
                                        onChange={() => toggleBarangay(b.id)}
                                    />
                                    {b.name}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end px-4 gap-2">
                        <button
                            className="text-sm px-2 py-1 cursor-pointer font-medium text-gray-700"
                            onClick={onClear}
                        >
                            Clear
                        </button>

                        <PopOver.Close>
                            <button
                                className="text-sm px-2 py-1 cursor-pointer font-medium text-blue-500"
                                onClick={onDone}
                            >
                                Done
                            </button>
                        </PopOver.Close>
                    </div>
                </div>
            </PopOver.Content>
        </PopOver>
    )
}
