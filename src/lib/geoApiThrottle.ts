/**
 * Serialize geocoding/routing calls with a 1s pause before each run (free public APIs).
 */
const PAUSE_MS = 1000

let chain: Promise<unknown> = Promise.resolve()

export function scheduleGeoRequest<T>(execute: () => Promise<T>): Promise<T> {
  const run = chain.then(async () => {
    await new Promise((r) => setTimeout(r, PAUSE_MS))
    return execute()
  })
  chain = run.then(() => undefined).catch(() => undefined)
  return run
}
