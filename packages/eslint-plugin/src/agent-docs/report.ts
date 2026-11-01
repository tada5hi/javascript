/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Rule } from 'eslint';

type Position = { line: number, column: number };

/**
 * The location of an offset in the language's own coordinates. Markdown
 * counts lines and columns from 1, JavaScript columns from 0, so the source
 * code object is asked rather than the text counted here.
 */
export function locFromIndex(context: Rule.RuleContext, index: number): Position {
    const sourceCode = context.sourceCode as unknown as { getLocFromIndex?: (index: number) => Position };

    if (typeof sourceCode.getLocFromIndex === 'function') {
        return sourceCode.getLocFromIndex(index);
    }

    const before = context.sourceCode.text.slice(0, index).split('\n');

    return { line: before.length, column: (before.at(-1) ?? '').length };
}

/**
 * Run `check` once per file on the root node: `root` for Markdown, which the
 * rules are written for, and `Program` for JavaScript. Other languages name
 * their root differently and are not supported.
 */
export function onFile(check: () => void): Rule.RuleListener {
    let done = false;
    const run = () => {
        if (done) {
            return;
        }

        done = true;
        check();
    };

    return { Program: run, root: run } as Rule.RuleListener;
}
