import { controllerNextItemInterface } from '@/src/shared/presentation/http/interfaces/controller-next-item-meta.interface'

export const isControllerNextItem = (value: unknown): value is controllerNextItemInterface => {
  if(value === undefined || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;


  return (
    typeof record.limit === 'string' &&
    (typeof record.id === 'string' || typeof record.id === 'undefined') &&
    (typeof record.created_at === 'string' || typeof record.created_at === 'undefined' || record.created_at instanceof Date)
  );
}