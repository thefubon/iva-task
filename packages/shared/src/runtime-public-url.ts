/** `next build` — NODE_ENV=production, но HTTP-сервера ещё нет. */
export function isNextProductionBuildPhase(): boolean {
  return process.env.NEXT_PHASE === 'phase-production-build'
}

/** payload generate:types / generate:importmap — без боевых env. */
export function isPayloadGenerateCliPhase(): boolean {
  return process.env.PAYLOAD_CLI === 'true'
}

/** Строгая проверка WEB_PUBLIC_URL — только когда production-сервер уже отдаёт HTTP. */
export function shouldEnforceProductionPublicUrl(): boolean {
  if (process.env.NODE_ENV !== 'production') {
    return false
  }
  if (isNextProductionBuildPhase()) {
    return false
  }
  if (isPayloadGenerateCliPhase()) {
    return false
  }
  return true
}
