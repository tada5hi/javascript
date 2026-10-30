# ESLint Convention Mapping

Investigated 2026-10-29 against the current `master` branches. These are policy sources, not evidence
that every source file in either project already complies.

## Sources

- [init-agent-docs template](https://github.com/tada5hi/skills/blob/master/skills/init-agent-docs/templates/.agents/conventions.md):
  Naming Conventions, File Organization.
- [Authup conventions](https://github.com/authup/authup/blob/master/.agents/conventions.md):
  File Organization, Interfaces & Types.
- [PrivateAIM Hub conventions](https://github.com/PrivateAIM/hub/blob/master/.agents/conventions.md):
  TypeScript.

## Implemented Mapping

| Documented policy | ESLint implementation | Limits |
|-------------------|-----------------------|--------|
| Interfaces carry `I`; aliases do not | `@typescript-eslint/naming-convention` in the default config | Alias rejection matches `^I[A-Z]`, not ordinary words such as `Input` and `Identity`; interface suffix uses PascalCase; declaration files exempt to preserve third-party/global augmentation |
| Exported types live in `types.ts`, not implementation files | `@tada5hi/type-declaration-location` | Exported interfaces and aliases, including export-later forms; not inferred exported classes/enums; declaration files exempt |
| Barrels re-export their own folder, not other modules | `@tada5hi/no-reexport-shims` | Re-export-from only in `index.*`, relative descendants only; no filesystem/package/alias resolution |
| Internal imports target owners, not the package root barrel | `@tada5hi/no-root-barrel-import` | Relative imports within a discoverable `src/` tree; not TS path aliases or self-package imports |
| One class per file | Existing core `max-classes-per-file` | Already enabled by default; no new rule needed |

The config applies module-layout rules by default to JavaScript and TypeScript under `src/`. This avoids imposing
source structure on build scripts and tests outside source roots. Naming checks apply when TypeScript is enabled;
Vue SFCs also receive naming checks when Vue is enabled, not `types.ts` placement requirements for component-local types.
The standalone `@tada5hi/eslint-plugin` `configs.conventions` preset is still composed explicitly by its consumers;
it is separate from the unified config's default layer.

## Statement Spacing (Explicitly Confirmed)

Compared [Chamvi bundle.ts](https://github.com/chamvi/chamvi/blob/feat/approved-skills/packages/app/src/skills/bundle.ts)
with [the user's preferred version](https://gist.github.com/tada5hi/42bc28ea19f2415f5ce06944c35add7b).
The user confirmed blank lines around complete loops, `if` chains, `try` chains, and `switch` at all
nesting levels, plus before every `return` (not only multiline returns). Do not insert blank lines at
block edges or between connected `else`, `catch`, and `finally` branches. Additionally, require a blank
line between variable declarations (`const`, `let`, `var`) and following expression statements, and after
expression statements before non-expression statements. Blank lines between consecutive expression
statements (including calls and assignments) are optional. Consecutive declarations can stay together.
There is no independent spacing requirement for `break`, `continue`, `throw`, or switch-case boundaries.

Implemented using the existing autofixable `@stylistic/padding-line-between-statements` rule in
`configs/stylistic/module.ts`; no custom AST rule is necessary. Tests cover all loop forms, nested
statements, single/multiline returns, branch chains, comments, fix idempotence, JS/TS/Vue and overrides.

## Condition Readability (Explicitly Confirmed)

The user additionally requested extracting collection operations from conditions into named variables.
Confirmed scope: `if`/`else if`, `while`, `do…while`, `for` tests, and ternary tests. Confirmed syntax-based
method list: `map`, `filter`, `flatMap`, `some`, `every`, `find`, `findIndex`, `findLast`, `findLastIndex`,
`reduce`, `reduceRight`. This intentionally can match custom methods; no TypeScript program is needed.
Simple predicates, `includes`, and `has` remain allowed. No switch-discriminant or Vue-template enforcement.

Implemented as `@tada5hi/no-collection-call-in-condition`, enabled by default independently of source-layout
scopes. Skip nested/deferred function bodies; no automatic variable extraction because short-circuiting,
callback evaluation, and loop re-evaluation must not change silently.

## Additional Rule Candidates (Not Implemented)

| Candidate | Source | Design boundary |
|-----------|--------|-----------------|
| Error filenames omit `-error` | Template File Organization; Hub Best Practices | Narrow suffix check in error directories is reliable; base files and acronym mapping need exceptions |
| Required source header | Template File Organization; Hub Best Practices | Preserve existing years; generated/config files need path exemptions; Vue uses HTML comments |
| HTTP errors stay outside core | Authup Validation & Error Handling | Resolve imported constructors and aliases, not names alone; scope to core paths |
| No module-scope socket/client caches | Hub Socket Injection and Best Practices | Target known factories/injectors; do not prohibit all module-level values |
| Contract-first public types | Authup Interfaces & Types; optional template companion | Requires class-symbol/provenance analysis and third-party exceptions |
| Query operator helper usage | Hub Query Filters | Existing Hub selectors already enforce part of it; improve context/Vue coverage rather than ban primitive equality filters |
| Exported constants in `constants.ts` | Template File Organization | First distinguish constant data from exported functions, providers, and instances |
| Symbol-based error guards | Hub Best Practices; Authup Validation & Error Handling | Requires concrete protocol and sibling-file analysis; no blanket `instanceof` ban |

These are candidates, not new shared defaults. Some represent project-specific architecture; use scoped
rule configuration or overrides rather than adding a generic conventions feature switch.

## Intentionally Not Enforced

- **Interfaces only describe class-implemented contracts:** Authup requires this, but Hub explicitly
  rejects it for its core-kit domain entities. The template additionally permits factory-returned
  interfaces. Do not use `consistent-type-definitions` to flatten these distinctions.
- **Contract-first design and precise payload types:** syntax-only bans on `typeof`, mapped types,
  or `Partial` would flag valid third-party boundaries and unrelated data transformations.
- **A concept gets a folder, exported constants go in `constants.ts`:** identifying a semantic
  constant versus an exported implementation arrow function requires more policy than the sources establish.
- **Kebab-case filenames, enum casing, member ordering/accessibility, and method syntax:** no common
  adopted policy was found. The template's list of possible naming examples is not a mandate.
- **Project-specific environment naming, API query restrictions, migration naming, and framework
  usage:** not common to all three sources and not enabled globally.

The template itself is conditional: introduce its interface bullets only where the project already
follows them. The unified config enables the conventions by default; downstream projects must migrate violations or
use per-rule overrides for exceptions. There are no unsafe
automatic symbol renames or file moves; users migrate each package deliberately.
