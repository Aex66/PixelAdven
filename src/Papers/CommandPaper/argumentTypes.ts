
import { staticTypes } from "../@types/CommandTypes";
export const staticBook = {
    create: {
        des: 'Create method, IDK',
        val: ['create', 'c-', 'make', 'new', 'm-'],
        con: (val: string) => val.replace(/[a-zA-Z0-9-_ ]/g, '') === '',
        err: 'You cannot use special characters!'
    },
    delyeet: {
        des: 'Deletes stuff',
        val: ['delete', 'delyeet', 'd-', 'yeet'],
        con: (val: string) => val.replace(/[a-zA-Z0-9-_ ]/g, '') === '',
        err: 'You cannot use special characters!'
    },
    add: {
        des: 'Adds stuff',
        val: ['add', 'a-', 'push'],
        con: (val: string) => true,
        err: 'You cannot use special characters!'
    },
    remove: {
        des: 'Removes stuff',
        val: ['remove', 'r-', 'rem', 're', 'delete'],
        con: (val: string) => val.replace(/[a-zA-Z0-9-_ ]/g, '') === '',
        err: 'You cannot use special characters!'
    },
    save: {
        des: 'Saves stuff',
        val: ['save', 's-', 'sav'],
        con: (val: string) => val.replace(/[a-zA-Z0-9-_ ]/g, '') === '',
        err: 'You cannot use special characters!'
    },
    list: {
        des: 'See stuff',
        val: ['list', 'l-', 'lis', 'tell'],
        con: (val: string) => val ? val.replace(/[a-zA-Z0-9-_ ]/g, '') === '' : true,
        err: 'You cannot use special characters!'
    },
    sell: {
        des: 'Sell stuff',
        val: [`sell`, 's-'],
        con: (val: string) => val /* You can write code here to make sure it's a Minecraft item without writing it every time inside a commond*/,
        err: 'That is not a Minecraft item'
    },
    teleport: {
        des: 'Relative coordinates',
        val: ['tp', 'teleport', 'go', 'go-to'],
        con: (val: string) => val.replace(/[a-zA-Z0-9-_ ]/g, '') === '',
        err: 'You cannot use special characters!'
    },
    send: {
        des: '',
        val: ['send'],
        con: (val: string) => val.replace(/[a-zA-Z0-9-_ ]/g, '') === '',
        err: 'You cannot use special characters!'
    },
    decline: {
        des: '',
        val: ['deny', 'decline', 'no', 'cancel'],
        con: (val: string) => val.replace(/[a-zA-Z0-9-_ ]/g, '') === '',
        err: 'You cannot use special characters!'
    },
    play: {
        des: '',
        val: ['play', 'p', 'start'],
        con: (val: string) => val ? val.replace(/[a-zA-Z0-9-_ ]/g, '') === '' : true,
        err: 'You cannot use special characters!'
    },
    try: {
        des: '',
        val: ['try', 'tryo', 'tr'],
        con: (val: string) => val ? val.replace(/[a-zA-Z0-9-_ ]/g, '') === '' : true,
        err: 'You cannot use special characters!'
    },
    quit: {
        des: '',
        val: ['quit', 'q', 'qu'],
        con: (val: string) => val ? val.replace(/[a-zA-Z0-9-_ ]/g, '') === '' : true,
        err: 'You cannot use special characters!'
    },
    set: {
        des: '',
        val: ['set', 'push', 'put'],
        con: (val: string) => val ? val.replace(/[a-zA-Z0-9-_ ]/g, '') === '' : true,
        err: 'You cannot use special characters!'
    },
    rename: {
        des: '',
        val: ['rename', 'name', 'rn', 'rname'],
        con: () => true,
        err: 'You cannot use special characters!'
    },
    join: {
        desc: '',
        val: ['join', 'enter'],
        con: () => true,
        err: 'You cannot use special characters!'
    },
    replace: {
        desc: '',
        val: ['replace'],
        con: () => true,
        err: 'You cannot use special characters!'
    },
    toggle: {
        desc: '',
        val: ['toggle'],
        con: () => true,
        err: 'You cannot use special characters!'
    },
    top: {
        desc: '',
        val: ['top'],
        con: () => true,
        err: ''
    },
} /* as { [key: string]: { des: string, val: string[], con?: (val: string) => boolean, err?: string }}*/ ;
export const staticKeys = Object.keys(staticBook), staticValues = staticKeys.map((key: staticTypes) => staticBook[key].val).flat();