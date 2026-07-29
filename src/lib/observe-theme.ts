/** Notifies on `data-theme` flips on the document element. Callers re-read the
 *  parts of the theme they care about; this only reports that it changed. */
export const observeTheme = (onChange: () => void): (() => void) => {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })
  return () => observer.disconnect()
}
