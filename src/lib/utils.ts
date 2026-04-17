/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const arrayToObjectById = <
  T extends Record<string, any>,
  K extends keyof T,
  F extends keyof T = keyof T,
>(
  arr: T[],
  key: K,
  fields?: F[],
): Record<string | number, any> =>
  arr.reduce(
    (acc, item) => {
      const id = item[key] as string | number;

      if (fields && fields.length > 0) {
        const selected = {} as Pick<T, F>;
        fields.forEach((field) => {
          selected[field] = item[field];
        });
        acc[id] = selected;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: _, ...rest } = item;
        acc[id] = rest;
      }

      return acc;
    },
    {} as Record<string | number, any>,
  );
