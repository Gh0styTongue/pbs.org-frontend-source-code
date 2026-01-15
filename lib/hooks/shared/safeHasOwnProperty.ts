// eslint-disable-next-line @typescript-eslint/no-explicit-any
const safeHasOwnProperty = (obj: any, prop: string): boolean => (obj ? Object.prototype.hasOwnProperty.call(obj, prop) : false)

export default safeHasOwnProperty
