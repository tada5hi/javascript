/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';
import { Linter } from 'eslint';
import unicornPlugin from 'eslint-plugin-unicorn';
import eslintConfig from '../../src/index.ts';

describe('unicorn rules', () => {
    const linter = new Linter();

    async function getConfig() {
        return eslintConfig({
            typescript: false,
            vue: false,
        });
    }

    async function getUnicornRuleNames() {
        const config = await getConfig();
        const names = new Set<string>();

        for (const entry of config) {
            for (const name of Object.keys(entry.rules ?? {})) {
                if (name.startsWith('unicorn/')) {
                    names.add(name);
                }
            }
        }

        return [...names];
    }

    it('should only configure rules that exist in the plugin', async () => {
        const names = await getUnicornRuleNames();

        expect(names.length).toBeGreaterThan(0);

        const unknown = names.filter((name) => !unicornPlugin.rules[name.replace('unicorn/', '')]);
        expect(unknown).toEqual([]);
    });

    it('should not configure deprecated rules', async () => {
        const names = await getUnicornRuleNames();

        const deprecated = names.filter((name) => {
            const rule = unicornPlugin.rules[name.replace('unicorn/', '')];
            return Boolean(rule?.meta?.deprecated);
        });

        expect(deprecated).toEqual([]);
    });

    it('should enforce unicorn/no-instanceof-builtins', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'const x = [];\nconst y = x instanceof Array;\n',
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === 'unicorn/no-instanceof-builtins');
        expect(error).toBeDefined();
    });

    it('should enforce unicorn/no-array-fill-with-reference-type', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'const x = Array.from({ length: 3 }).fill([]);\n',
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === 'unicorn/no-array-fill-with-reference-type');
        expect(error).toBeDefined();
    });

    it('should enforce unicorn/no-duplicate-logical-operands', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'const f = (x) => x && x;\n',
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === 'unicorn/no-duplicate-logical-operands');
        expect(error).toBeDefined();
    });

    it('should enforce unicorn/no-impossible-length-comparison', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'const f = (x) => x.length < 0;\n',
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === 'unicorn/no-impossible-length-comparison');
        expect(error).toBeDefined();
    });

    it('should enforce unicorn/no-useless-coercion', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'const x = String(\'x\');\n',
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === 'unicorn/no-useless-coercion');
        expect(error).toBeDefined();
    });

    it('should enforce unicorn/prefer-math-abs', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'const f = (x) => (x < 0 ? -x : x);\n',
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === 'unicorn/prefer-math-abs');
        expect(error).toBeDefined();
    });

    it.each([
        ['unicorn/no-unused-builtin-method-return', 'const s = new Set([1]);\ns.union(new Set([2]));\n'],
        ['unicorn/no-async-iterator-callback', 'Iterator.from([1]).filter(async (v) => v);\n'],
        ['unicorn/no-incomplete-accessor-override', 'class A { get x() { return 1; } set x(v) {} }\nclass B extends A { get x() { return 2; } }\n'],
        ['unicorn/no-invalid-property-descriptor', 'Object.defineProperty({}, \'p\', { get() { return 1; }, writable: false });\n'],
        ['unicorn/no-invalid-response-options', 'const r = new Response(\'\', { status: 204 });\n'],
        ['unicorn/no-invalid-url-protocol-comparison', 'const ok = new URL(\'https://a.b\').protocol === \'https\';\n'],
        ['unicorn/no-invalid-intl-options', 'const f = new Intl.NumberFormat(\'en\', { style: \'percentage\' });\n'],
        ['unicorn/no-invalid-temporal-arithmetic', 'const d = Temporal.Now.instant().add({ days: 1 });\n'],
        ['unicorn/no-unsafe-json-serialization', 'const j = JSON.stringify({ a: new Set([1]) });\n'],
        ['unicorn/no-unused-iterator-helper', 'new Map().values().map((v) => v);\n'],
        ['unicorn/no-url-in-search-params', 'const p = new URLSearchParams(\'https://example.com/?q=1\');\n'],
        ['unicorn/no-useless-set-construction', 'const a = new Set([1]);\nconst b = new Set([2]);\nconst c = a.union(new Set(b));\n'],
        ['unicorn/no-using-resource-escape', 'function open(f) {\n    using h = f();\n    return h;\n}\n'],
        ['unicorn/require-text-decoder-streaming', 'async function read(url) {\n    const response = await fetch(url);\n    const decoder = new TextDecoder();\n    let text = \'\';\n    for await (const chunk of response.body) {\n        text += decoder.decode(chunk);\n    }\n    return text;\n}\n'],
        ['unicorn/no-prevent-default-in-passive-listener', 'document.addEventListener(\'wheel\', (e) => { e.preventDefault(); }, { passive: true });\n'],
        ['unicorn/no-invalid-dom-token', 'document.body.classList.add(\'a b\');\n'],
        ['unicorn/no-invalid-style-set-property', 'document.body.style.setProperty(\'backgroundColor\', \'red\');\n'],
        ['unicorn/no-invalid-boolean-attribute-value', 'document.createElement(\'button\').setAttribute(\'disabled\', \'false\');\n'],
        ['unicorn/prefer-promise-static-methods', 'const p = new Promise((resolve) => resolve(1));\n'],
        ['unicorn/prefer-temporal-conversion', 'const i = Temporal.Instant.from(Temporal.Now.zonedDateTimeISO());\n'],
        ['unicorn/prefer-uint8array-base64', 'const s = Buffer.from(new Uint8Array([1])).toString(\'base64\');\n'],
        ['unicorn/prefer-uint8array-hex', 'const s = Buffer.from(new Uint8Array([1])).toString(\'hex\');\n'],
        ['unicorn/prefer-regexp-escape', 'const f = (s) => s.replace(/[.*+?^${}()|[\\]\\\\]/g, \'\\\\$&\');\n'],
        ['unicorn/prefer-error-is-error', 'const f = (e) => e instanceof Error;\n'],
        ['unicorn/prefer-promise-try', 'const f = (fn) => new Promise((resolve) => resolve(fn()));\n'],
        ['unicorn/prefer-iterator-zip', 'function f(a, b) {\n    for (let i = 0; i < Math.min(a.length, b.length); i++) {\n        console.log(a[i], b[i]);\n    }\n}\n'],
        ['unicorn/prefer-combined-guards', 'function f(a, b) {\n    if (a) {\n        return;\n    }\n    if (b) {\n        return;\n    }\n}\n'],
        ['unicorn/no-unnecessary-default-arguments', 'function run(always = true) {\n    return always;\n}\nrun(true);\n'],
        ['unicorn/prefer-short-escape-sequences', 'const t = \'a\\u000Ab\';\n'],
        ['unicorn/prefer-literal-ascii', 'const t = \'\\x41\';\n'],
        ['unicorn/prefer-escaped-irregular-whitespace', 'const t = \'a\u00A0b\';\n'],
        ['unicorn/no-leading-empty-lines', '\n\nconst a = 1;\n'],
    ])('should enforce %s', async (ruleId, code) => {
        const config = await getConfig();
        const messages = linter.verify(code, config, { filename: 'test.js' });
        const error = messages.find((m) => m.ruleId === ruleId);
        expect(error).toBeDefined();
    });

    it.each([
        ['unicorn/no-conflicting-constraints', 'const el = <input type="number" min={10} max={5} />;\n'],
        ['unicorn/no-ineffective-csp-directives', 'const el = <meta httpEquiv="Content-Security-Policy" content="frame-ancestors \'none\'" />;\n'],
        ['unicorn/no-invalid-integrity', 'const el = <script src="app.js" integrity={\'sha256-\' + \'abc\'} />;\n'],
    ])('should enforce %s in JSX', async (ruleId, code) => {
        const config = await eslintConfig(
            { typescript: false, vue: false },
            { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
        );
        const messages = linter.verify(code, config, { filename: 'test.js' });
        const error = messages.find((m) => m.ruleId === ruleId);
        expect(error).toBeDefined();
    });
});
