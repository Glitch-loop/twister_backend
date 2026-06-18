import { httpResponseLoginInterface } from "@/src/shared/presentation/http/interfaces/http-response-login.interface"

export function isHttpResponseLogin(value: unknown): value is httpResponseLoginInterface {
  if(value === undefined || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.message === 'string' &&
    typeof record.data === 'string'
  );
}