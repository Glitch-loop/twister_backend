export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && value !== undefined;
}

export function isArray(value: unknown): value is Array<any> {
  return Array.isArray(value) && value !== null && value !== undefined;
}