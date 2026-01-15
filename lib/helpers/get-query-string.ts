export const getQueryString = ():string => {
  if (typeof window !== "undefined") {
    return window.location.search
  } else {
    return ''
  }
}