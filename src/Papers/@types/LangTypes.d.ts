
interface lang {
    setup: {
        version: string
        notSetup: string
        setup: string
        loaded: (ms: number) => string

    }
    cmd: {
        unknown: (prefix: string, admin: boolean) => string
        useForm: string
        wrongPrefix: (prefix: string) => string
        noArgs: string
        notAArg: (prefix: string, cmd: string, before: string[], err: string, afther?: string, tip?: string) => string
        noPerms: string
        noArgPerm: string
        missingArgs: (prefix: string, cmd: string, args: string[], tip?: string) => string
        maxArgs: (error: string) => string
        needVal: (prefix: string, val: string) => string
        valErr: (prefix: string, val: string) => string
        openQou: string
        missingPlr: (val: string) => string

    }
    chat: {
        mutted: string

    }
}