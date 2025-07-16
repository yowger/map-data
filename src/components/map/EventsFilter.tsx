import PopOver from "../ui/PopOver"

type EventsFilterDropdownProps = {
    selected: string[]
    onChange: (selected: string[]) => void
    events: string[]
    onClear?: () => void
    onDone?: () => void
}

export function EventsFilterDropdown({
    selected,
    onChange,
    events,
    onClear,
    onDone,
}: EventsFilterDropdownProps) {
    const toggleEvents = (event: string) => {
        onChange(
            selected.includes(event)
                ? selected.filter((h) => h !== event)
                : [...selected, event]
        )
    }

    return (
        <PopOver>
            <PopOver.Trigger>
                <button className="px-3.5 py-1.5 bg-gray-200 rounded-md text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-300">
                    <span className="mr-1.5">
                        {selected.length > 0 && `${selected.length}`} Events
                    </span>
                    <i className="fa-solid fa-caret-down" />
                </button>
            </PopOver.Trigger>

            <PopOver.Content>
                <div className="py-3 flex flex-col space-y-4 w-48 shadow-md overflow-auto">
                    <div className="px-4">
                        <div className="flex flex-col gap-1">
                            {events.map((event) => (
                                <label
                                    key={event}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        value={event}
                                        checked={selected.includes(event)}
                                        onChange={() => toggleEvents(event)}
                                    />
                                    {event}
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
                        <button
                            className="text-sm px-2 py-1 cursor-pointer font-medium text-blue-500"
                            onClick={onDone}
                        >
                            Done
                        </button>
                    </div>
                </div>
            </PopOver.Content>
        </PopOver>
    )
}
