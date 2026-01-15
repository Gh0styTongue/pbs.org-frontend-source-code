import Cookies from "js-cookie";

async function asyncDeleteCookie(key: string, options?: Cookies.CookieAttributes) {
  Cookies.remove(key, options)

  return new Promise<void>((resolve) => {
    const intervalId = setInterval(() => {
      if(!Cookies.get(key)) {
        clearInterval(intervalId)
        resolve()
      }
    }, 100)
  })
}

export { asyncDeleteCookie }
