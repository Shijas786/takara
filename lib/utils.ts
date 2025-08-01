import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Type Guard to check if a value is a valid React element
 * This prevents "Objects are not valid as a React child" errors
 */
export function isValidReactElement(node: any): node is React.ReactElement {
  return (
    typeof node === 'object' && 
    node !== null && 
    '$$typeof' in node && 
    node.$$typeof === Symbol.for('react.element')
  );
}

/**
 * Safe render function that checks if a value is a valid React element
 * Returns the element if valid, or a fallback if not
 */
export function safeRender(
  element: any, 
  fallback: React.ReactNode = null
): React.ReactNode {
  return isValidReactElement(element) ? element : fallback;
}
