/**
 * Minimal class joiner.
 *
 * The components this site borrows from the shadcn ecosystem import `cn` from
 * `@/lib/utils`, which normally wraps clsx + tailwind-merge. This project is
 * not a shadcn project and writes its own CSS rather than composing Tailwind
 * utilities, so there are no conflicting utility classes to merge away. Two
 * dependencies to concatenate strings would be dead weight.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
