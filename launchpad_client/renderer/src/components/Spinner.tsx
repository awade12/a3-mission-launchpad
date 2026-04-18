import type { CSSProperties, HTMLAttributes } from 'react'

export type SpinnerProps = {
  /**
   * Preset diameter (responsive via `clamp` + `vmin`) or an exact pixel size.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | number
  /** Ring highlight color; track is a faded mix of this color. Default white. */
  color?: string
  className?: string
  style?: CSSProperties
} & Omit<HTMLAttributes<HTMLSpanElement>, 'children'>

/**
 * Indeterminate circular loader. White by default; pass `color` on light surfaces.
 * Sizes scale with the viewport via presets, or set a fixed pixel `size`.
 */
export function Spinner({
  size = 'md',
  color,
  className,
  style,
  'aria-hidden': ariaHidden,
  'aria-label': ariaLabel,
  ...rest
}: SpinnerProps) {
  const decorative = ariaHidden === true
  const sizeClass = typeof size === 'number' ? undefined : `lp-spinner--${size}`
  const mergedStyle: CSSProperties = {
    ...style,
    ...(typeof size === 'number' ? { ['--lp-spinner-size' as string]: `${size}px` } : {}),
    ...(color ? { ['--lp-spinner-color' as string]: color } : {}),
  }

  return (
    <span
      className={['lp-spinner', sizeClass, className].filter(Boolean).join(' ')}
      style={mergedStyle}
      role={decorative ? undefined : 'status'}
      aria-live={decorative ? undefined : 'polite'}
      aria-label={decorative ? undefined : (ariaLabel ?? 'Loading')}
      aria-hidden={ariaHidden}
      {...rest}
    />
  )
}
