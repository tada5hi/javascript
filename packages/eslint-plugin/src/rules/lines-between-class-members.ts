/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Rule } from 'eslint';
import stylistic from '@stylistic/eslint-plugin';

const baseRule = stylistic.rules['lines-between-class-members'];

const rule: Rule.RuleModule = {
    ...baseRule,
    create(context) {
        const listener = baseRule.create(context);

        return {
            ...listener,
            ClassBody(node) {
                // Extend upstream's field selector without mutating the parser's AST.
                const body = node.body.map((member) => {
                    if (/^(?:TSAbstractPropertyDefinition|AccessorProperty|TSAbstractAccessorProperty)$/u.test(member.type)) {
                        // ESLint's ESTree types omit these TypeScript property variants.
                        return { ...member, type: 'PropertyDefinition' } as typeof member;
                    }

                    return member;
                });
                listener.ClassBody?.({ ...node, body });
            },
        };
    },
};

export default rule;
