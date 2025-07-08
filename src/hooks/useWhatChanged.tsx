import { useEffect, useRef } from 'react'

export function useWhatChanged(deps: any[], names: string[]) {
  const prevDepsRef = useRef<any[]>()

  useEffect(() => {
    if (!prevDepsRef.current) {
      prevDepsRef.current = deps
      return
    }

    const changed = deps
      .map((val, i) => {
        const prev = prevDepsRef.current![i]
        if (!Object.is(prev, val)) {
          return {
            index: i,
            name: names[i],
            from: prev,
            to: val,
          }
        }
        return null
      })
      .filter(Boolean)

    if (changed.length > 0) {
      console.log('[useEffect changed deps]', changed)
    }

    prevDepsRef.current = deps
  }, deps)
}
