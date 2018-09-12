export function detect () {
  return (
    'IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'isIntersecting' in window.IntersectionObserverEntry.prototype
  )
}
