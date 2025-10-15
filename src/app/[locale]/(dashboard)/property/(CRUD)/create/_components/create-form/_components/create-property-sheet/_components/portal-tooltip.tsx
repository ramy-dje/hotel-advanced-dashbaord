import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

export function PortalTooltip({ children, content }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLSpanElement>(null)
  const [boxStyles, setBoxStyles] = useState({ left: 0, top: 0 })

  useEffect(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setBoxStyles({
      left: rect.right,
      top: rect.top - 8, // tweak vertical offset
    })
  }, [open])

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="inline-block cursor-pointer"
      >
        {children}
      </span>

      {open &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              left: boxStyles.left,
              top: boxStyles.top,
              zIndex: 9999,
            }}
            className="bg-gray-800 text-white text-xs rounded-lg p-3 max-w-xs"
          >
            {content}
          </div>,
          document.body
        )}
    </>
  )
}
