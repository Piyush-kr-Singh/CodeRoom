import type { CodeChange } from "@codeshare/shared";

export function applyCodeChanges(code: string, changes: CodeChange[]) {
  return changes.reduce((draft, change) => {
    const before = draft.slice(0, change.rangeOffset);
    const after = draft.slice(change.rangeOffset + change.rangeLength);

    return `${before}${change.text}${after}`;
  }, code);
}
