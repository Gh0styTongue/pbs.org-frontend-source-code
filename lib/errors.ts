class ArgumentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ValidationError"
  }
}

class MVaultError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "MVaultMembershipError"
  }
}

class MissingRefreshTokenError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "MissingRefreshTokenError"
  }
}

class StationDataCacheEmptyError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'StationDataCacheEmptyError'
  }
}

class NoAuthenticatedSessionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NoAuthenticatedSessionError'
  }
}

class ClientSessionInvalid extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ClientSessionInvalid'
  }
}

class SerializedAutoCompleteDatabaseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SerializedAutoCompleteDatabaseError'
  }
}

export {
  ArgumentError,
  MVaultError,
  MissingRefreshTokenError,
  StationDataCacheEmptyError,
  NoAuthenticatedSessionError,
  ClientSessionInvalid,
  SerializedAutoCompleteDatabaseError
}
