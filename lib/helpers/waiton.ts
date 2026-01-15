// Takes a variable and the path to the variable you want to want to wait for
// The options take the interval you want to wait between checks, and a timeout
// in case you want to change the time it takes to fail open
export default async function waitOn(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variable: any,
  path: string[],
  options = {
    interval: 200,
    timeout: 60000,
  }
) {
  const pathSize = path.length - 1

  return new Promise((resolve, reject) => {
    let previous = variable
    const startTime = new Date()

    const interval = setInterval(() => {
      path.forEach((pathVar, index) => {
        if (previous[pathVar]) {
          previous = previous[pathVar]

          if (index === pathSize) {
            // then we've got the final variable we wanted
            clearInterval(interval)
            resolve(previous)
          }
        } else {
          // That part of the path doesn't exist yet
          // keep spinning until it does or check the timeout

          const now = new Date()
          const seconds = now.getTime() - startTime.getTime()

          if (seconds > options.timeout) {
            clearInterval(interval)
            reject(new Error(`Timeout of ${options.timeout} elapsed`))
          }
        }
      })
    }, options.interval)
  })
}
