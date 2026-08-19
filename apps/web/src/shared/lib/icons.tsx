import * as React from "react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  Alert02Icon,
  ArrowRight01Icon,
  ArrowUpDownIcon,
  ArrowUpRight01Icon,
  Cancel01Icon,
  CancelCircleIcon,
  ChevronDown as ChevronDownSvg,
  ChevronUp as ChevronUpSvg,
  ComponentIcon,
  Download01Icon,
  EyeIcon,
  EyeOff as EyeOffSvg,
  FigmaIcon,
  Home01Icon,
  InformationCircleIcon,
  MinusSignIcon,
  Monitor as MonitorSvg,
  Moon01Icon,
  PaintBrush01Icon,
  Palette as PaletteSvg,
  PanelLeftOpenIcon,
  PanelRightOpenIcon,
  PlusSignIcon,
  RecordIcon,
  Refresh01Icon,
  Shield01Icon,
  SourceCodeIcon,
  StarIcon,
  Sun01Icon,
  TextFontIcon,
  Trophy as TrophySvg,
  UserIcon,
  UserMultipleIcon,
  ViewIcon,
  Wrench01Icon,
  ZapIcon,
  Link01Icon,
  Plug01Icon,
} from "@hugeicons/core-free-icons"

type IconProps = Omit<React.ComponentProps<typeof HugeiconsIcon>, "icon"> & {
  className?: string
}

function createIcon(IconSvg: IconSvgElement, strokeWidth = 2) {
  function Icon({ className, ...props }: IconProps) {
    return (
      <HugeiconsIcon
        icon={IconSvg}
        className={className}
        strokeWidth={strokeWidth}
        {...props}
      />
    )
  }
  return Icon
}

export const AlertTriangle = createIcon(Alert02Icon)
export const ArrowRight = createIcon(ArrowRight01Icon)
export const ArrowUpDown = createIcon(ArrowUpDownIcon)
export const ArrowUpRight = createIcon(ArrowUpRight01Icon)
export const ChevronDown = createIcon(ChevronDownSvg)
export const ChevronUp = createIcon(ChevronUpSvg)
export const CircleDot = createIcon(RecordIcon)
export const CircleX = createIcon(CancelCircleIcon)
export const Code2 = createIcon(SourceCodeIcon)
export const Component = createIcon(ComponentIcon)
export const Download = createIcon(Download01Icon)
export const Eye = createIcon(EyeIcon)
export const EyeOff = createIcon(EyeOffSvg)
export const Figma = createIcon(FigmaIcon)
export const FileWarning = createIcon(Alert02Icon)
export const Home = createIcon(Home01Icon)
export const Info = createIcon(InformationCircleIcon)
export const Link = createIcon(Link01Icon)
export const Minus = createIcon(MinusSignIcon)
export const Monitor = createIcon(MonitorSvg)
export const Moon = createIcon(Moon01Icon)
export const Paintbrush = createIcon(PaintBrush01Icon)
export const Palette = createIcon(PaletteSvg)
export const PanelLeft = createIcon(PanelLeftOpenIcon)
export const PanelLeftOpen = createIcon(PanelLeftOpenIcon)
export const PanelRightOpen = createIcon(PanelRightOpenIcon)
export const Plug = createIcon(Plug01Icon)
export const Plus = createIcon(PlusSignIcon)
export const RefreshCw = createIcon(Refresh01Icon)
export const ShieldCheck = createIcon(Shield01Icon)
export const Star = createIcon(StarIcon)
export const Sun = createIcon(Sun01Icon)
export const Trophy = createIcon(TrophySvg)
export const Type = createIcon(TextFontIcon)
export const User = createIcon(UserIcon)
export const Users = createIcon(UserMultipleIcon)
export const View = createIcon(ViewIcon)
export const Wrench = createIcon(Wrench01Icon)
export const X = createIcon(Cancel01Icon)
export const Zap = createIcon(ZapIcon)

export { Cancel01Icon, HugeiconsIcon }
