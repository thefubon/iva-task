"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogOverlay({
  className,
  variant = "default",
  ...props
}: DialogPrimitive.Backdrop.Props & {
  variant?: "default" | "blur"
}) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 transition-colors duration-200 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 data-closed:pointer-events-none",
        variant === "blur" ? "bg-black/15 backdrop-blur-xs" : "bg-black/65",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  overlayVariant = "default",
  closeOnOutsideClick: _closeOnOutsideClick = true,
  closeButtonPlacement = "inside",
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
  overlayVariant?: "default" | "blur"
  closeOnOutsideClick?: boolean
  closeButtonPlacement?: "inside" | "outside"
}) {
  void _closeOnOutsideClick
  return (
    <DialogPortal>
      <DialogOverlay
        variant={overlayVariant}
        className="grid items-start justify-center overflow-y-hidden px-4 pt-4 pb-4 sm:overflow-y-auto sm:pt-12 sm:pb-12"
      >
        <div className="relative z-50 w-full max-w-lg">
          <DialogPrimitive.Popup
            data-slot="dialog-content"
            className={cn(
              "bg-background data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 relative grid w-full gap-4 rounded-lg border p-6 shadow-lg duration-200 max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-h-none sm:overflow-visible",
              className
            )}
            {...props}
          >
            {children}

            {showCloseButton && closeButtonPlacement === "inside" && (
              <DialogPrimitive.Close
                data-slot="dialog-close"
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="absolute top-4 right-4 rounded-full opacity-70 hover:bg-secondary hover:opacity-100"
                  />
                }
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                <span className="sr-only">Закрыть</span>
              </DialogPrimitive.Close>
            )}

            {showCloseButton && closeButtonPlacement === "outside" && (
              <DialogPrimitive.Close
                data-slot="dialog-close-outside"
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 translate-x-0 sm:right-0 sm:translate-x-full sm:-mr-3 rounded-full bg-secondary/90 text-foreground shadow-sm backdrop-blur-sm opacity-100 hover:bg-secondary"
                  />
                }
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                <span className="sr-only">Закрыть</span>
              </DialogPrimitive.Close>
            )}
          </DialogPrimitive.Popup>
        </div>
      </DialogOverlay>
    </DialogPortal>
  )
}

function DialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  sticky = false,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & { sticky?: boolean; showCloseButton?: boolean }) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        sticky && "-mx-6 -mb-6 mt-2 border-t border-border bg-background px-6 py-4 sticky bottom-0 rounded-b-lg",
        className
      )}
      {...props}
    >
      {showCloseButton && (
        <DialogClose render={<Button variant="outline" />}>Закрыть</DialogClose>
      )}
      {children}
    </div>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
