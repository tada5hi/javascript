/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export function isPackageExists(name: string): boolean {
    try {
        import.meta.resolve(name);
        return true;
    } catch {
        return false;
    }
}

export async function ensurePackages(packages: string[]): Promise<void> {
    const missing = packages.filter((pkg) => !isPackageExists(pkg));

    if (missing.length === 0) {
        return;
    }

    const { installPackage } = await import('@antfu/install-pkg');

    await installPackage(missing, { dev: true });
}
