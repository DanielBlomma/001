import { X } from 'lucide-react'
import { Button } from './Button'

export function Dialog({ open, onClose, children }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({ children, onClose }) {
  return (
    <div className="flex items-center justify-between p-6 border-b">
      <div className="flex-1">{children}</div>
      {onClose && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="ml-4"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}

export function DialogTitle({ children }) {
  return (
    <h2 className="text-2xl font-bold">{children}</h2>
  )
}

export function DialogContent({ children }) {
  return (
    <div className="p-6">
      {children}
    </div>
  )
}

export function DialogFooter({ children }) {
  return (
    <div className="flex items-center justify-end gap-2 p-6 border-t">
      {children}
    </div>
  )
}
