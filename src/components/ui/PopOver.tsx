import {
    type ReactNode,
    type ReactElement,
    type HTMLAttributes,
    isValidElement,
    cloneElement,
    createContext,
    useContext,
    useState,
    useRef,
    type Dispatch,
    type SetStateAction,
    useLayoutEffect,
} from "react"

type Position = "bottom-center" | "bottom-left" | "bottom-right"

type PopOverProps = {
    children: ReactNode
    position?: Position
}

type TriggerProps = {
    children: ReactElement<HTMLAttributes<HTMLElement>>
}

type ContentProps = {
    children: ReactNode
}

type CloseProps = {
    children: ReactElement<HTMLAttributes<HTMLElement>>
}

type PickedRect = Pick<DOMRect, "left" | "top" | "width" | "height">

type PopoverContextType = {
    isOpen: boolean
    toggle: () => void
    close: () => void
    position: Position
    triggerRect: PickedRect
    setTriggerRect: Dispatch<SetStateAction<PickedRect>>
}

const DEFAULT_POSITION = "bottom-center"

const DEFAULT_TRIGGER_RECT = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
}

const PopoverContext = createContext<PopoverContextType | null>({
    isOpen: false,
    toggle: () => {},
    close: () => {},
    position: DEFAULT_POSITION,
    triggerRect: DEFAULT_TRIGGER_RECT,
    setTriggerRect: () => {
        throw new Error("setTriggerRect should be used under provider")
    },
})

function usePopoverContext(component: string) {
    const popOverContext = useContext(PopoverContext)

    if (!popOverContext) {
        throw new Error(`${component} should be used under PopOver.Provider`)
    }

    return popOverContext
}

export default function PopOver({
    children,
    position = DEFAULT_POSITION,
}: PopOverProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [triggerRect, setTriggerRect] = useState(DEFAULT_TRIGGER_RECT)

    const toggle = () => setIsOpen((prev) => !prev)
    const close = () => setIsOpen(false)

    const contextValue: PopoverContextType = {
        isOpen,
        toggle,
        close,
        position,
        triggerRect,
        setTriggerRect,
    }

    return (
        <PopoverContext.Provider value={contextValue}>
            {children}
        </PopoverContext.Provider>
    )
}

function Trigger({ children }: TriggerProps) {
    const { toggle, setTriggerRect } = usePopoverContext("PopOver.Trigger")

    if (!isValidElement(children)) {
        throw new Error("Trigger requires a valid React element.")
    }

    const ref = useRef<HTMLElement>(null)

    const handleClick = () => {
        const element = ref.current

        if (element == null) {
            return
        }

        const rect = element.getBoundingClientRect()
        setTriggerRect(rect)

        toggle()
    }

    const childrenToTriggerPopover = cloneElement(children, {
        onClick: handleClick,
        ref,
    })

    return childrenToTriggerPopover
}

function Content({ children }: ContentProps) {
    const { isOpen } = usePopoverContext("PopOver.Content")

    if (!isOpen) {
        return null
    }

    return <ContentInternal>{children}</ContentInternal>
}

function ContentInternal({ children }: ContentProps) {
    const { position, triggerRect } = usePopoverContext(
        "PopOver.ContentInternal"
    )
    const ref = useRef<HTMLDialogElement>(null)
    const [coords, setCoords] = useState({ top: 0, left: 0 })

    useLayoutEffect(() => {
        const element = ref.current

        if (element == null) {
            return
        }

        const rect = element.getBoundingClientRect()
        console.log("🚀 ~ useLayoutEffect ~ triggerRect:", triggerRect)
        console.log("🚀 ~ useLayoutEffect ~ rect:", rect)

        const coords = getPopOverCoords(triggerRect, rect, position)
        setCoords(coords)
    }, [])

    return (
        <dialog
            open={true}
            ref={ref}
            style={{
                position: "fixed",
                left: `${coords.left}px`,
                top: `${coords.top}px`,
                margin: 0,
            }}
        >
            {children}
        </dialog>
    )
}

function Close({ children }: CloseProps) {
    const { close } = usePopoverContext("PopOver.Close")

    if (!isValidElement(children)) {
        throw new Error("Close requires a valid React element.")
    }

    const handleClick = () => {
        close()
    }

    const childrenToClosePopover = cloneElement(children, {
        onClick: handleClick,
    })

    return childrenToClosePopover
}

function getPopOverCoords(
    triggerRect: PickedRect,
    popoverRect: PickedRect,
    position: Position
) {
    switch (position) {
        case "bottom-center":
        default: {
            const spacing = 10
            const minLeftPadding = 10

            let top = triggerRect.top + triggerRect.height + spacing

            const left = Math.max(
                triggerRect.left +
                    triggerRect.width / 2 -
                    popoverRect.width / 2,
                minLeftPadding
            )

            const wouldOverflowBottom =
                top + popoverRect.height > window.innerHeight

            if (wouldOverflowBottom) {
                top = triggerRect.top - spacing - popoverRect.height
            }

            return { top, left }
        }
    }
}

PopOver.Trigger = Trigger
PopOver.Content = Content
PopOver.Close = Close
