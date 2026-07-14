# AI Development Workflow

This repository uses an issue-first, pull-request-based AI development workflow.

## Default flow

1. Product discussion or test feedback identifies a real problem.
2. Create or update a GitHub Issue with problem, goal, scope, acceptance criteria, priority, and MVP classification.
3. Product orchestration checks scope and business-rule alignment.
4. An implementation agent works on one scoped issue or approved slice on a branch.
5. The implementation is validated with available lint, typecheck, tests, and build checks.
6. Open a Pull Request linked to the Issue.
7. Independent review checks product behavior, business rules, permissions, data visibility, regressions, security risk, and test gaps.
8. Where UX or operational flow changed, run the relevant user-journey or admin-operations audit.
9. Merge only after blocking review findings are resolved.
10. Close the Issue when its acceptance criteria are met in user-visible behavior.

## AI team roles

- `product-orchestrator`: scopes product problems and coordinates specialist work.
- `implementation-engineer`: implements one scoped issue at a time.
- `user-journey-tester`: acts as a zero-context Thai Buyer or Supplier.
- `admin-ops-auditor`: audits platform admin and operational workflows.
- `pr-reviewer`: independently reviews Pull Requests and does not implement the feature being reviewed.

## Founder interaction rule

The founder should be able to describe problems in normal language. Product-relevant observations should be converted into durable GitHub Issues instead of being left only in chat history.

The founder is primarily responsible for vision, product judgment, and user-visible acceptance—not reading every line of code.

## Guardrails

- Do not merge broad, risky, or unclear work directly into `main`.
- Do not let the implementation agent self-approve its own Pull Request.
- Do not fabricate reviews, ratings, sales counts, completed-order counts, popularity, or trust metrics.
- Do not expose Supplier-only Platform Fee information to Buyers.
- Do not expand major MVP scope while unresolved P0 first-use blockers remain.
- Changes involving authentication, authorization, payments, destructive data operations, or schema migrations require explicit risk review before merge.

## Issue quality

A development Issue should normally include:

- Problem
- User or role affected
- Goal
- Scope
- Guardrails or business rules
- Acceptance criteria
- Priority: P0 / P1 / P2
- Classification: MVP REQUIRED / OPTIONAL / POST MVP

## Pull Request quality

A Pull Request should normally include:

- Linked Issue
- User-visible behavior changed
- Main implementation areas
- Checks run and results
- Screenshots or route references when UI changed
- Known limitations or risks

This workflow is the default development operating model for OEM Hub Thailand.