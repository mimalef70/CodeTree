import fs from 'node:fs/promises';
import path from 'node:path';
import Handlebars from 'handlebars';
import type { CodeTreeConfigMerged } from '../../config/configSchema.js';
import { CodeTreeError } from '../../shared/errorHandle.js';
import { generateTreeString } from '../file/fileTreeGenerate.js';
import type { ProcessedFile } from '../file/fileTypes.js';
import type { OutputGeneratorContext } from './outputGeneratorTypes.js';
import { getMarkdownTemplate } from './outputStyles/markdownStyle.js';
import { getPlainTemplate } from './outputStyles/plainStyle.js';
import { getXmlTemplate } from './outputStyles/xmlStyle.js';

const createRenderContext = (outputGeneratorContext: OutputGeneratorContext) => {
  return {
    headerText: outputGeneratorContext.config.output.headerText,
    instruction: outputGeneratorContext.instruction,
    treeString: outputGeneratorContext.treeString,
    processedFiles: outputGeneratorContext.processedFiles,
  };
};

export const generateOutput = async (
  rootDir: string,
  config: CodeTreeConfigMerged,
  processedFiles: ProcessedFile[],
  allFilePaths: string[],
): Promise<string> => {
  const outputGeneratorContext = await buildOutputGeneratorContext(rootDir, config, allFilePaths, processedFiles);
  const renderContext = createRenderContext(outputGeneratorContext);

  let template: string;
  switch (config.output.style) {
    case 'xml':
      template = getXmlTemplate();
      break;
    case 'markdown':
      template = getMarkdownTemplate();
      break;
    default:
      template = getPlainTemplate();
  }

  const compiledTemplate = Handlebars.compile(template);
  return `${compiledTemplate(renderContext).trim()}\n`;
};

export const buildOutputGeneratorContext = async (
  rootDir: string,
  config: CodeTreeConfigMerged,
  allFilePaths: string[],
  processedFiles: ProcessedFile[],
): Promise<OutputGeneratorContext> => {
  let repositoryInstruction = '';

  if (config.output.instructionFilePath) {
    const instructionPath = path.resolve(rootDir, config.output.instructionFilePath);
    try {
      repositoryInstruction = await fs.readFile(instructionPath, 'utf-8');
    } catch {
      throw new CodeTreeError(`Instruction file not found at ${instructionPath}`);
    }
  }

  return {
    treeString: generateTreeString(allFilePaths),
    processedFiles,
    config,
    instruction: repositoryInstruction,
  };
};
