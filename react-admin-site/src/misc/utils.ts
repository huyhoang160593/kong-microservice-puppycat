import { twMerge } from 'tailwind-merge';
import clsx, { type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function generateCustomEvent<
  T extends keyof GlobalEventHandlersEventMap,
  U extends GlobalEventHandlersEventMap[T] extends CustomEvent<infer TDetail>
    ? TDetail
    : never,
>(name: T, detail: U) {
  return new CustomEvent(name, { detail });
}
