/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { posix } from 'node:path';

export const {
    basename,
    dirname,
    isAbsolute,
    join,
} = posix;

export function normalizePath(value: string): string {
    return posix.normalize(value.replaceAll('\\', '/'));
}

export function knownFilename(filename: string): string | undefined {
    if (filename.startsWith('<')) {
        return undefined;
    }

    return normalizePath(filename);
}

export function isRelative(source: string): boolean {
    return source === '.' || source === '..' || source.startsWith('./') || source.startsWith('../');
}
