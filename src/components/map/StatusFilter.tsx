import PopOver from "../ui/PopOver"

type StatusFilterDropdownProps = {
    selected: string[]
    onChange: (selected: string[]) => void
    statuses: string[]
    onClear?: () => void
    onDone?: () => void
}

export function StatusFilterDropdown({
    selected,
    onChange,
    statuses,
    onClear,
    onDone,
}: StatusFilterDropdownProps) {
    const toggleStatus = (status: string) => {
        onChange(
            selected.includes(status)
                ? selected.filter((s) => s !== status)
                : [...selected, status]
        )
    }

    return (
        <PopOver>
            <PopOver.Trigger>
                <button className="px-3.5 py-1.5 bg-gray-200 rounded-md text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-300">
                    <span className="mr-1.5">
                        {selected.length > 0 && `${selected.length}`} Status
                    </span>
                    <i className="fa-solid fa-caret-down" />
                </button>
            </PopOver.Trigger>

            <PopOver.Content>
                <div className="py-3 flex flex-col space-y-4 w-48 shadow-md overflow-auto">
                    <div className="px-4">
                        <div className="flex flex-col gap-1">
                            {statuses.map((status) => (
                                <label
                                    key={status}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        value={status}
                                        checked={selected.includes(status)}
                                        onChange={() => toggleStatus(status)}
                                    />
                                    {status}
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
