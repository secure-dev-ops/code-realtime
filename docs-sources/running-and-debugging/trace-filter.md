# Trace Filter

Use Trace Filter in the sequence diagram to focus on relevant events in large trace files.

!!! note
	This page is currently a placeholder and will be extended with additional examples.

## What You Can Filter

- `Instances`: matches sender and receiver instance names and addresses.
- `Messages`: matches event labels.

You can use only one field or both fields together.

## Quick Start

1. Open a `.art-trace` file.
2. Open Sequence Diagram.
3. Open the Trace Filter panel.
4. Enter patterns in `Instances` and/or `Messages`.
5. Click `Apply Filter`.
6. Click `Clear Filter` to remove all filters.

## Filter Behavior

- Instance-only filtering keeps events related to matching instances.
- Message-only filtering keeps events whose labels match message patterns.
- Combined filtering applies both instance and message criteria.
- Invalid regex input is rejected and an error is shown in the status area.

## Regex Input Rules

- Input is interpreted as JavaScript regular expressions.
- Matching is case-insensitive.
- Use `|` for alternatives.

Examples:

- `Instances`: `capsuleA|capsuleB|0x101`
- `Messages`: `ping|reply|timeout`

## Useful Regex Patterns

- Exact match: `^ping$`
- Starts with: `^rt_`
- Ends with: `_done$`
- Contains text: `.*timer.*`
- Contains digits: `.*\d+.*`
- Hexadecimal address: `^0x[0-9a-f]+$`

## Escaping Special Characters

Escape regex symbols when you want literal text:

- Dot: `\.`
- Parentheses: `\(` and `\)`
- Plus: `\+`
- Question mark: `\?`

Example literal match:

- `timer.expired(1)` becomes `^timer\.expired\(1\)$`

## Paging in Sequence Diagram

Large traces are paged for rendering performance.

- Each page shows 20 events.
- The page indicator uses this format: `Page X/Y (A-B of N)`.
- Scrolling to bottom moves to next page.
- Scrolling to top moves to previous page.
- Applying or clearing filters resets the view to page 1.
- If highlighting or navigation targets an event on a different page, the diagram switches to that page first.

## Troubleshooting

Issue: No results after applying filters.

Check:

1. Pattern typo.
2. Overly strict anchors (`^...$`).
3. Escaping for literal characters.
4. Test each field separately.

Issue: Too many results.

Check:

1. Missing anchors.
2. Overly broad patterns like `.*`.
3. Unescaped special characters.

Issue: Paging seems wrong.

Check:

1. Verify event count in page indicator.
2. Confirm filters were applied.
3. Confirm page reset behavior after apply or clear.
