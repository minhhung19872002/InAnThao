import { createElement, useState } from 'react'
import { css } from './css'

/**
 * Element with design-file style strings.
 *   <H as="a" s="padding:10px" h="background:#fff" href="#">…</H>
 * `s`  = the design's style="…" string
 * `h`  = the design's style-hover="…" string (merged while hovered)
 */
export default function H({ as = 'div', s, h, style, children, onMouseEnter, onMouseLeave, ...rest }) {
  const [hover, setHover] = useState(false)
  const base = { ...(css(s) || {}), ...(style || {}) }
  const merged = hover && h ? { ...base, ...css(h) } : base
  const props = { ...rest, style: merged }
  if (h) {
    props.onMouseEnter = (e) => { setHover(true); onMouseEnter?.(e) }
    props.onMouseLeave = (e) => { setHover(false); onMouseLeave?.(e) }
  } else {
    if (onMouseEnter) props.onMouseEnter = onMouseEnter
    if (onMouseLeave) props.onMouseLeave = onMouseLeave
  }
  return createElement(as, props, children)
}
