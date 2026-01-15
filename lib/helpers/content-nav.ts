const contentNavRoutes = [
  new RegExp('/explore/(.*)'),
  '/'
]

export default function shouldRenderContentNav(path: string) {
  return contentNavRoutes.some(route => {
    const isRegex = route instanceof RegExp

    if(isRegex) {
      if(path.match(route)) {
        return true
      }
    } else {
      return path === route
    }
  })
}
