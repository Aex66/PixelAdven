import { ShowdownInterpreter } from '../showdownInterpreter.js';
import { SideupdateErrorHandler, SideupdateRequestStubHandler } from './sideupdateLineHandlers.js';

ShowdownInterpreter.registerSideupdate('error', new SideupdateErrorHandler());
ShowdownInterpreter.registerSideupdate('request', new SideupdateRequestStubHandler());
