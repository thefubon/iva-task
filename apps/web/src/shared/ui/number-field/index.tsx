"use client"

import * as React from "react"
import { Minus, Plus } from "@/shared/lib/icons"

import { cn } from "@/shared/lib/utils"

type NumberFieldSize = "sm" | "default" | "lg"
type NumberFieldVariant = "primary" | "secondary"
type NumberFieldState = "default" | "error" | "warning" | "success"

interface NumberFieldContextValue {
  size: NumberFieldSize
  variant: NumberFieldVariant
  state: NumberFieldState
  value: number
  min?: number
  max?: number
  step: number
  disabled: boolean
  setValue: (v: number) => void
  increment: () => void
  decrement: () => void
}

const NumberFieldContext = React.createContext<NumberFieldContextValue | null>(null)

function useNumberField() {
  const ctx = React.useContext(NumberFieldContext)
  if (!ctx) throw new Error("useNumberField must be used within NumberField")
  return ctx
}

interface NumberFieldProps {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  size?: NumberFieldSize
  variant?: NumberFieldVariant
  state?: NumberFieldState
  onValueChange?: (value: number) => void
  className?: string
  children: React.ReactNode
}

function NumberField({
  value: valueProp,
  defaultValue = 0,
  min,
  max,
  step = 1,
  disabled = false,
  size = "default",
  variant = "primary",
  state = "default",
  onValueChange,
  className,
  children,
}: NumberFieldProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const value = valueProp ?? internalValue

  const setValue = React.useCallback(
    (v: number) => {
      const clamped = Math.min(Math.max(v, min ?? -Infinity), max ?? Infinity)
      if (valueProp === undefined) setInternalValue(clamped)
      onValueChange?.(clamped)
    },
    [min, max, valueProp, onValueChange]
  )

  const increment = React.useCallback(() => setValue(value + step), [value, step, setValue])
  const decrement = React.useCallback(() => setValue(value - step), [value, step, setValue])

  const ctx = React.useMemo<NumberFieldContextValue>(
    () => ({ size, variant, state, value, min, max, step, disabled, setValue, increment, decrement }),
    [size, variant, state, value, min, max, step, disabled, setValue, increment, decrement]
  )

  return (
    <NumberFieldContext.Provider value={ctx}>
      <div className={cn("grid gap-1.5", className)}>
        {children}
      </div>
    </NumberFieldContext.Provider>
  )
}

function NumberFieldContent({ className, children }: { className?: string; children: React.ReactNode }) {
  const { size } = useNumberField()
  const sizeClass =
    size === "sm"
      ? "[&>[data-slot=input]]:has-[[data-slot=increment]]:pr-4 [&>[data-slot=input]]:has-[[data-slot=decrement]]:pl-4"
      : size === "lg"
        ? "[&>[data-slot=input]]:has-[[data-slot=increment]]:pr-6 [&>[data-slot=input]]:has-[[data-slot=decrement]]:pl-6"
        : "[&>[data-slot=input]]:has-[[data-slot=increment]]:pr-5 [&>[data-slot=input]]:has-[[data-slot=decrement]]:pl-5"

  return <div className={cn("relative", sizeClass, className)}>{children}</div>
}

function NumberFieldInput({ className, ...props }: React.ComponentProps<"input">) {
  const { size, variant, state, value, disabled, setValue } = useNumberField()

  const isInvalid = props["aria-invalid"] === true || props["aria-invalid"] === "true"
  const visualState = isInvalid ? "error" : state

  const sizeClass =
    size === "sm" ? "h-8 text-sm min-w-24" : size === "lg" ? "h-10 text-base min-w-32" : "h-9 text-sm min-w-28"

  const variantClass =
    variant === "secondary"
      ? "border-border bg-muted placeholder:text-secondary hover:bg-background hover:border-primary focus-visible:bg-background focus-visible:border-primary active:bg-background active:border-primary disabled:hover:bg-muted disabled:hover:border-border"
      : "border-input hover:border-primary focus-visible:border-primary active:border-primary disabled:hover:border-input"

  const stateClass =
    visualState === "error"
      ? "border-destructive text-destructive placeholder:text-destructive/70"
      : visualState === "warning"
        ? "border-warning text-warning placeholder:text-warning/70"
        : visualState === "success"
          ? "border-primary text-primary placeholder:text-primary/70"
          : ""

  return (
    <input
      data-slot="input"
      data-variant={variant}
      data-size={size}
      data-state={visualState !== "default" ? visualState : undefined}
      type="text"
      inputMode="numeric"
      value={value}
      disabled={disabled}
      onChange={(e) => {
        const n = Number(e.target.value)
        if (!isNaN(n)) setValue(n)
      }}
      className={cn(
        "flex w-full rounded-md border py-1 text-center tabular-nums transition-colors duration-200 focus-visible:outline-none disabled:opacity-50",
        variantClass,
        stateClass,
        sizeClass,
        className
      )}
      {...props}
    />
  )
}

function NumberFieldDecrement({ className, children }: { className?: string; children?: React.ReactNode }) {
  const { size, disabled, decrement, value, min } = useNumberField()
  const isDisabled = disabled || (min !== undefined && value <= min)
  const sizeClass = size === "sm" ? "p-2 min-w-8" : size === "lg" ? "p-4 min-w-10" : "p-3 min-w-9"

  return (
    <button
      type="button"
      data-slot="decrement"
      disabled={isDisabled}
      onClick={decrement}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 left-0 flex items-center justify-center cursor-pointer disabled:opacity-20 disabled:cursor-default",
        sizeClass,
        className
      )}
    >
      {children ?? <Minus className={cn("h-4 w-4", size === "lg" && "h-5 w-5")} />}
    </button>
  )
}

function NumberFieldIncrement({ className, children }: { className?: string; children?: React.ReactNode }) {
  const { size, disabled, increment, value, max } = useNumberField()
  const isDisabled = disabled || (max !== undefined && value >= max)
  const sizeClass = size === "sm" ? "p-2 min-w-8" : size === "lg" ? "p-4 min-w-10" : "p-3 min-w-9"

  return (
    <button
      type="button"
      data-slot="increment"
      disabled={isDisabled}
      onClick={increment}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 right-0 flex items-center justify-center cursor-pointer disabled:opacity-20 disabled:cursor-default",
        sizeClass,
        className
      )}
    >
      {children ?? <Plus className={cn("h-4 w-4", size === "lg" && "h-5 w-5")} />}
    </button>
  )
}

export {
  NumberField,
  NumberFieldContent,
  NumberFieldInput,
  NumberFieldDecrement,
  NumberFieldIncrement,
}
export type { NumberFieldSize, NumberFieldVariant, NumberFieldState }
