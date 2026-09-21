/* Minimal ambient declarations. The sandbox has no registry access, so
   @types/node cannot be installed; only the APIs the build actually uses
   are declared here. */
declare module 'node:fs' {
  export interface Dirent { name: string; isDirectory(): boolean }
  export interface Stats { size: number }
  const fs: {
    rmSync(p: string, o?: { recursive?: boolean; force?: boolean }): void;
    mkdirSync(p: string, o?: { recursive?: boolean }): void;
    readdirSync(p: string): string[];
    readdirSync(p: string, o: { withFileTypes: true }): Dirent[];
    readFileSync(p: string, enc: 'utf8'): string;
    writeFileSync(p: string, data: string): void;
    copyFileSync(a: string, b: string): void;
    statSync(p: string): Stats;
    existsSync(p: string): boolean;
  };
  export default fs;
}
declare module 'node:path' {
  const path: {
    join(...p: string[]): string;
    dirname(p: string): string;
    resolve(...p: string[]): string;
  };
  export default path;
}
declare module 'node:url' {
  export function fileURLToPath(u: string | URL): string;
}
declare module 'node:child_process' {
  export function execFileSync(cmd: string, args: string[], o?: { stdio?: string; cwd?: string }): Buffer;
}
declare const process: { exit(code?: number): never; execPath: string; argv: string[]; env: Record<string, string | undefined> };
declare const console: { log(...a: unknown[]): void; error(...a: unknown[]): void; warn(...a: unknown[]): void };
declare interface Buffer { toString(enc?: string): string }
declare interface ImportMeta { url: string }
