import { ShowdownInterpreter } from '../showdownInterpreter.js';
import { EndChunkHandler } from './endChunkHandler.js';

ShowdownInterpreter.registerEnd(new EndChunkHandler());
