export function deconstructSemver(
  semverString: string
): { major: string; minor: string; patch: string; prerelease: string | undefined; build: string | undefined } | null {
  const match = /^(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:-([\w-]+))?(?:\+([\w-]+))?/i.exec(semverString);
  if (!match) {
    return null;
  }
  return {
    major: match[1],
    minor: match[2],
    patch: match[3],
    prerelease: match[4],
    build: match[5],
  };
}
