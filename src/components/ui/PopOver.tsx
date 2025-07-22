/*
    TODO: 
        create auto flipping
        create get window size, pos on change 
        keyboard event (ESC) to exit

    I have gained knowledge that making your own components is a pain in the ass.
*/

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
    type MouseEvent,
    type RefObject,
    Children,
} from "react"

import { useFocusTrap } from "../../hooks/useFocusTrap"
import { useOnClickOutside } from "../../hooks/useOnClickOutside"
import { mergeRefs } from "../../utils/mergeRefs"

const DEFAULT_POSITION = "bottom-center"

const DEFAULT_TRIGGER_RECT = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
}

type ReactElementWithRef = React.ReactElement<
    React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }
>

type Position = "bottom-center" | "bottom-left" | "bottom-right"

type PopOverProps = {
    children: ReactNode
    position?: Position
}

type TriggerProps = {
    children: ReactElementWithRef
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
    position: Position
    triggerRect: PickedRect
    triggerRef: RefObject<HTMLElement | null>
    close: () => void
    setTriggerRect: Dispatch<SetStateAction<PickedRect>>
    toggle: () => void
}

const PopoverContext = createContext<PopoverContextType | null>(null)

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
    const triggerRef = useRef<HTMLElement>(null)

    const toggle = () => setIsOpen((prev) => !prev)
    const close = () => setIsOpen(false)

    const contextValue: PopoverContextType = {
        triggerRef,
        isOpen,
        position,
        triggerRect,
        close,
        setTriggerRect,
        toggle,
    }

    return (
        <PopoverContext.Provider value={contextValue}>
            {children}
        </PopoverContext.Provider>
    )
}

function Trigger({ children }: TriggerProps) {
    const { triggerRef, toggle, setTriggerRect } =
        usePopoverContext("PopOver.Trigger")

    const handleClick = (event: MouseEvent) => {
        event.stopPropagation()

        if (!triggerRef.current) return

        const rect = triggerRef.current.getBoundingClientRect()
        setTriggerRect(rect)

        toggle()
    }

    if (!isValidElement(children)) {
        throw new Error("Trigger requires a valid React element.")
    }

    const childrenToTriggerPopover = cloneElement(children, {
        onClick: handleClick,
        ref: triggerRef,
    })

    return childrenToTriggerPopover
}

function Content({ children }: ContentProps) {
    const { isOpen } = usePopoverContext("PopOver.Content")

    if (!isOpen) return null

    return <ContentInternal>{children}</ContentInternal>
}

function ContentInternal({ children }: ContentProps) {
    const [coords, setCoords] = useState({ top: 0, left: 0 })
    const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined)
    const { triggerRef, isOpen, position, triggerRect, close } =
        usePopoverContext("PopOver.ContentInternal")

    const ref = useRef<HTMLDialogElement>(null)
    const { containerRef } = useFocusTrap<HTMLDialogElement>({
        isEnabled: isOpen,
        returnFocusOnClose: true,
    })
    const mergedRef = mergeRefs(ref, containerRef)
    useOnClickOutside<HTMLDialogElement>({
        ref,
        isEnabled: isOpen,
        excludeRef: isRefObjectWithElement(triggerRef) ? triggerRef : undefined,
        onClickOutside: () => close(),
    })

    useLayoutEffect(() => {
        const element = ref.current

        if (element == null) return

        const rect = element.getBoundingClientRect()

        const { left, top, availableHeight } = calculateCoordsAndSize(
            triggerRect,
            rect,
            position
        )

        const needsScroll = rect.height > availableHeight

        setMaxHeight(needsScroll ? availableHeight : undefined)

        setCoords({
            left,
            top,
        })
    }, [position, triggerRect])

    const contentArray = Children.toArray(children)

    const body = contentArray.find(
        (child) =>
            isValidElement(child) &&
            (child.type as { _role?: string })._role === "body"
    )
    const footer = contentArray.find(
        (child) =>
            isValidElement(child) &&
            (child.type as { _role?: string })._role === "footer"
    )

    return (
        <dialog
            open={true}
            ref={mergedRef}
            style={{
                left: `${coords.left}px`,
                top: `${coords.top}px`,
                maxHeight: maxHeight ? `${maxHeight}px` : undefined,
            }}
            className="fixed m-0 z-[500] border border-gray-300 rounded-md shadow-sm"
        >
            <div className="flex flex-col max-h-[inherit] min-h-0">
                <div className="overflow-y-auto max-h-[inherit] min-h-0">
                    {body}
                </div>

                {footer && footer}
            </div>
        </dialog>
    )
}

type BodyProps = {
    children: ReactNode
    className?: string
} & HTMLAttributes<HTMLDivElement>

type FooterProps = {
    children: ReactNode
    className?: string
} & HTMLAttributes<HTMLDivElement>

function Body({ children, className }: BodyProps) {
    return <div className={`p-3.5 ${className}`}>{children}</div>
}

function Footer({ children, className }: FooterProps) {
    return <div className={`px-3.5 py-3 ${className}`}>{children}</div>
}

function Close({ children }: CloseProps) {
    const { close } = usePopoverContext("PopOver.Close")

    const handleClick = (event: MouseEvent) => {
        event.stopPropagation()

        close()
    }

    if (!isValidElement(children)) {
        throw new Error("Close requires a valid React element.")
    }

    const childrenToClosePopover = cloneElement(children, {
        onClick: handleClick,
    })

    return childrenToClosePopover
}

// TODO: do other positions
function calculateCoordsAndSize(
    triggerRect: PickedRect,
    popoverRect: PickedRect,
    position: Position
) {
    switch (position) {
        case "bottom-center":
        default: {
            const spacing = 10
            const minLeftPadding = 10

            const spaceBelow =
                window.innerHeight -
                (triggerRect.top + triggerRect.height) -
                spacing
            const spaceAbove = triggerRect.top - spacing

            const shouldShowAbove =
                popoverRect.height > spaceBelow && spaceAbove > spaceBelow

            const availableHeight = shouldShowAbove
                ? triggerRect.top - spacing
                : window.innerHeight -
                  (triggerRect.top + triggerRect.height + spacing)

            const top = shouldShowAbove
                ? triggerRect.top - spacing - availableHeight
                : triggerRect.top + triggerRect.height + spacing

            const left = Math.max(
                triggerRect.left +
                    triggerRect.width / 2 -
                    popoverRect.width / 2,
                minLeftPadding
            )

            return { top, left, availableHeight }
        }
    }
}

function isRefObjectWithElement<T extends HTMLElement>(
    ref: RefObject<T | null>
): ref is RefObject<T> {
    return ref.current !== null
}

Body._role = "body"
Footer._role = "footer"

PopOver.Trigger = Trigger
PopOver.Content = Content
PopOver.Body = Body
PopOver.Footer = Footer
PopOver.Close = Close
