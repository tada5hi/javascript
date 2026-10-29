/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { knownFilename } from '../paths.ts';

const rule: TSESLint.RuleModule<'location', []> = {
    meta: {
        type: 'suggestion',
        docs: { description: 'Keep exported top-level interfaces and type aliases in types files.' },
        schema: [],
        messages: { location: 'Move this exported type declaration to types.ts (or types.mts, types.cts, types.tsx).' },
    },
    defaultOptions: [],
    create(context) {
        const filename = knownFilename(context.filename);

        if (!filename || /(?:^|\/)types\.(?:ts|mts|cts|tsx)$/u.test(filename) || /\.d\.(?:ts|mts|cts)$/u.test(filename)) {
            return {};
        }

        return {
            Program(program) {
                const exported = new Set<string>();
                const declarations: (TSESTree.TSInterfaceDeclaration | TSESTree.TSTypeAliasDeclaration)[] = [];

                for (const statement of program.body) {
                    let declaration: TSESTree.Node = statement;

                    if (statement.type === 'ExportNamedDeclaration') {
                        if (statement.source) {
                            continue;
                        }

                        for (const specifier of statement.specifiers) {
                            exported.add(specifier.local.name);
                        }

                        if (statement.declaration) {
                            declaration = statement.declaration;
                        }
                    } else if (statement.type === 'ExportDefaultDeclaration') {
                        declaration = statement.declaration;

                        if (declaration.type === 'Identifier') {
                            exported.add(declaration.name);
                        } else if (declaration.type === 'TSInterfaceDeclaration' || declaration.type === 'TSTypeAliasDeclaration') {
                            exported.add(declaration.id.name);
                        }
                    } else if (statement.type === 'TSExportAssignment' && statement.expression.type === 'Identifier') {
                        exported.add(statement.expression.name);
                    }

                    if (declaration.type === 'TSInterfaceDeclaration' || declaration.type === 'TSTypeAliasDeclaration') {
                        declarations.push(declaration);

                        if (declaration !== statement) {
                            exported.add(declaration.id.name);
                        }
                    }
                }

                for (const declaration of declarations) {
                    if (exported.has(declaration.id.name)) {
                        context.report({ node: declaration.id, messageId: 'location' });
                    }
                }
            },
        };
    },
};

export default rule;
