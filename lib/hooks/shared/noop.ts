import { type Noop } from '@/lib/types/utility'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const noop: Noop = (..._args: any[]) => undefined

noop.noop = true

export default noop
