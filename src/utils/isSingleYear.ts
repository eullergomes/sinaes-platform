import { ApiResponseSingleYear } from "@/types/alert-types";

export const isSingleYear = (res: unknown): res is ApiResponseSingleYear => {
  return !!res && typeof res === 'object' && 'alerts' in res && 'year' in res;
}