import type { CodeTreeConfigMerged } from '../../config/configSchema.js';
import type { ProcessedFile } from '../file/fileTypes.js';

export interface OutputGeneratorContext {
  treeString: string;
  processedFiles: ProcessedFile[];
  config: CodeTreeConfigMerged;
  instruction: string;
}
