# App Bar Brand Label Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the duplicated personal name in the app bar with the approved `DEV PORTFOLIO` brand label.

**Architecture:** Keep `RecruitmentNav` and its existing `#about` link intact. Change only the visible brand copy and its typography, then lock the behavior with a source-contract test.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Node test runner, Next.js 16.

## Global Constraints

- The app-bar label is exactly `DEV PORTFOLIO`.
- The Hero heading remains `오병희`.
- Navigation targets and responsive behavior remain unchanged.
- No new component, dependency, icon, or interaction is introduced.

---

### Task 1: Replace the duplicated app-bar name

**Files:**
- Modify: `test/developer-portfolio-structure.test.mjs`
- Modify: `src/components/widgets/RecruitmentNav.tsx`

**Interfaces:**
- Consumes: the existing `RecruitmentNav` source and `#about` anchor behavior.
- Produces: a `DEV PORTFOLIO` brand link that still targets `#about`.

- [ ] **Step 1: Write the failing source-contract test**

Add this test:

```js
test('app bar uses a portfolio brand label instead of repeating the hero name', () => {
  const navigation = read('src/components/widgets/RecruitmentNav.tsx');

  assert.match(navigation, />\s*DEV PORTFOLIO\s*</);
  assert.doesNotMatch(navigation, />\s*오병희\s*</);
  assert.match(navigation, /href="#about"/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test --test-name-pattern="app bar uses" test/developer-portfolio-structure.test.mjs`

Expected: FAIL because `RecruitmentNav.tsx` still renders `오병희`.

- [ ] **Step 3: Apply the minimal UI change**

In `RecruitmentNav.tsx`, keep `href="#about"` and replace the brand link content and typography with:

```tsx
className="shrink-0 text-xs font-semibold tracking-[0.18em] text-[#1f1b16] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e] sm:text-sm"
```

```tsx
DEV PORTFOLIO
```

- [ ] **Step 4: Verify GREEN and regressions**

Run:

```bash
node --test --test-name-pattern="app bar uses" test/developer-portfolio-structure.test.mjs
npm run test
npm run lint
npx tsc --noEmit --incremental false
npm run build
```

Expected: all commands exit 0; the full test suite reports 23 passing tests.

- [ ] **Step 5: Verify localhost output**

Run: `curl -sS http://localhost:3000 | rg -o 'DEV PORTFOLIO|오병희' | sort -u`

Expected: both `DEV PORTFOLIO` and `오병희` are present.
