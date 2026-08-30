import { useEffect, useRef, useState } from 'react'

export function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin: '0px 0px -50px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, visible]
}

export function revealClass(visible, extra = '') {
  return `transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${extra}`.trim()
}
