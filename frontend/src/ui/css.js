/**
 * Convert an inline CSS string (exactly as written in the design file) into a React style object.
 * Lets components keep the design's `style="..."` values verbatim.
 */
const cache = new Map()

const toCamel = (prop) => {
  const p = prop.trim()
  if (p.startsWith('--')) return p
  const camel = p.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
  // -webkit-foo -> WebkitFoo (React expects capitalised vendor prefix)
  return p.startsWith('-') ? camel.charAt(0).toUpperCase() + camel.slice(1) : camel
}

export function css(str) {
  if (!str) return undefined
  const hit = cache.get(str)
  if (hit) return hit
  const out = {}
  for (const decl of str.split(';')) {
    const i = decl.indexOf(':')
    if (i < 0) continue
    const prop = decl.slice(0, i)
    let val = decl.slice(i + 1).trim()
    if (!prop.trim()) continue
    val = val.replace(/\s*!important$/, '')
    out[toCamel(prop)] = val
  }
  cache.set(str, out)
  return out
}
