import { useEffect, useState } from 'react'

/**
 * Small data-fetching hook: runs `fn` whenever `deps` change.
 * Returns { data, loading, error, reload }.
 */
export function useApi(fn, deps = [], { fallback = null } = {}) {
  const [state, setState] = useState({ data: fallback, loading: true, error: null })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let alive = true
    setState((s) => ({ ...s, loading: true, error: null }))
    fn()
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((error) => alive && setState({ data: fallback, loading: false, error }))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  return { ...state, reload: () => setTick((t) => t + 1) }
}
