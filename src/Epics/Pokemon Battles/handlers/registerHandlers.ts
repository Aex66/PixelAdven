/**
 * Loads all Showdown handler registries (update / sideupdate / end).
 * Optional split handlers: register with {@link ShowdownInterpreter.registerSplit} from startup code.
 */
import './registerUpdateHandlers.js';
import './registerSideupdateHandlers.js';
import './registerEndHandler.js';
