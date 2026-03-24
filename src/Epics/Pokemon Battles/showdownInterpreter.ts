import type {
    IUpdateHandler,
    ISplitHandler,
    ISideupdateHandler,
    IEndChunkHandler,
} from './handlers/types.js';

/**
 * Registries for Showdown protocol dispatch (see `.cursor/rules/showdown-instructions.mdc`).
 *
 * - **Update** — public `update` chunk lines (prefix after first `|`).
 * - **Split** — `|split|pN` + private + public; keyed by the **private** line’s command.
 * - **Sideupdate** — private per-side single line (`request`, `error`, …).
 * - **End** — battle summary JSON line after `end`.
 */
export class ShowdownInterpreter {
    private static readonly updateHandlers = new Map<string, IUpdateHandler>();
    private static readonly splitHandlers = new Map<string, ISplitHandler>();
    private static readonly sideupdateHandlers = new Map<string, ISideupdateHandler>();
    private static endHandler: IEndChunkHandler | null = null;

    /** Same as {@link ShowdownInterpreter.registerUpdate}. */
    static register(cmd: string, handler: IUpdateHandler): void {
        this.registerUpdate(cmd, handler);
    }

    static registerUpdate(cmd: string, handler: IUpdateHandler): void {
        this.updateHandlers.set(cmd, handler);
    }

    static registerSplit(privateLineCmd: string, handler: ISplitHandler): void {
        this.splitHandlers.set(privateLineCmd, handler);
    }

    static registerSideupdate(cmd: string, handler: ISideupdateHandler): void {
        this.sideupdateHandlers.set(cmd, handler);
    }

    static registerEnd(handler: IEndChunkHandler): void {
        this.endHandler = handler;
    }

    /** Same as {@link ShowdownInterpreter.getUpdateHandler}. */
    static getHandler(cmd: string): IUpdateHandler | undefined {
        return this.getUpdateHandler(cmd);
    }

    static getUpdateHandler(cmd: string): IUpdateHandler | undefined {
        return this.updateHandlers.get(cmd);
    }

    static getSplitHandler(privateLineCmd: string): ISplitHandler | undefined {
        return this.splitHandlers.get(privateLineCmd);
    }

    static getSideupdateHandler(cmd: string): ISideupdateHandler | undefined {
        return this.sideupdateHandlers.get(cmd);
    }

    static getEndHandler(): IEndChunkHandler | null {
        return this.endHandler;
    }
}
