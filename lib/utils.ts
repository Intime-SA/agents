import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Función para obtener la fecha/hora actual en UTC Argentina (UTC-3) como ISO string
export function getArgentinaTimeISOString(): string {
  const now = new Date();
  // UTC-3 para Argentina
  const argentinaTime = new Date(now.getTime() - (3 * 60 * 60 * 1000));
  return argentinaTime.toISOString();
}