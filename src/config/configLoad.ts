import * as fs from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
import { CodeTreeError, rethrowValidationErrorIfZodError } from '../shared/errorHandle.js';
import { logger } from '../shared/logger.js';
import {
  type CodeTreeConfigCli,
  type CodeTreeConfigFile,
  type CodeTreeConfigMerged,
  defaultConfig,
  defaultFilePathMap,
  codetreeConfigFileSchema,
  codetreeConfigMergedSchema,
} from './configSchema.js';
import { getGlobalDirectory } from './globalDirectory.js';

const defaultConfigPath = 'codetree.config.json';

const getGlobalConfigPath = () => {
  return path.join(getGlobalDirectory(), 'codetree.config.json');
};

export const loadFileConfig = async (rootDir: string, argConfigPath: string | null): Promise<CodeTreeConfigFile> => {
  let useDefaultConfig = false;
  let configPath = argConfigPath;
  if (!configPath) {
    useDefaultConfig = true;
    configPath = defaultConfigPath;
  }

  const fullPath = path.resolve(rootDir, configPath);

  logger.trace('Loading local config from:', fullPath);

  // Check local file existence
  const isLocalFileExists = await fs
    .stat(fullPath)
    .then((stats) => stats.isFile())
    .catch(() => false);

  if (isLocalFileExists) {
    return await loadAndValidateConfig(fullPath);
  }

  if (useDefaultConfig) {
    // Try to load global config
    const globalConfigPath = getGlobalConfigPath();
    logger.trace('Loading global config from:', globalConfigPath);

    const isGlobalFileExists = await fs
      .stat(globalConfigPath)
      .then((stats) => stats.isFile())
      .catch(() => false);

    if (isGlobalFileExists) {
      return await loadAndValidateConfig(globalConfigPath);
    }

    logger.note(
      `No custom config found at ${configPath} or global config at ${globalConfigPath}.\nYou can add a config file for additional settings. Please check https://github.com/mimalef70/CodeTree for more information.`,
    );
    return {};
  }
  throw new CodeTreeError(`Config file not found at ${configPath}`);
};

const loadAndValidateConfig = async (filePath: string): Promise<CodeTreeConfigFile> => {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const config = JSON.parse(fileContent);
    return codetreeConfigFileSchema.parse(config);
  } catch (error) {
    rethrowValidationErrorIfZodError(error, 'Invalid config schema');
    if (error instanceof SyntaxError) {
      throw new CodeTreeError(`Invalid JSON in config file ${filePath}: ${error.message}`);
    }
    if (error instanceof Error) {
      throw new CodeTreeError(`Error loading config from ${filePath}: ${error.message}`);
    }
    throw new CodeTreeError(`Error loading config from ${filePath}`);
  }
};

export const mergeConfigs = (
  cwd: string,
  fileConfig: CodeTreeConfigFile,
  cliConfig: CodeTreeConfigCli,
): CodeTreeConfigMerged => {
  logger.trace('Default config:', defaultConfig);

  const baseConfig = defaultConfig;

  // If the output file path is not provided in the config file or CLI, use the default file path for the style
  if (cliConfig.output?.filePath == null && fileConfig.output?.filePath == null) {
    const style = cliConfig.output?.style || fileConfig.output?.style || baseConfig.output.style;
    baseConfig.output.filePath = defaultFilePathMap[style];

    logger.trace('Default output file path is set to:', baseConfig.output.filePath);
  }

  const mergedConfig = {
    cwd,
    output: {
      ...baseConfig.output,
      ...fileConfig.output,
      ...cliConfig.output,
    },
    include: [...(baseConfig.include || []), ...(fileConfig.include || []), ...(cliConfig.include || [])],
    ignore: {
      ...baseConfig.ignore,
      ...fileConfig.ignore,
      ...cliConfig.ignore,
      customPatterns: [
        ...(baseConfig.ignore.customPatterns || []),
        ...(fileConfig.ignore?.customPatterns || []),
        ...(cliConfig.ignore?.customPatterns || []),
      ],
    }
  };

  try {
    return codetreeConfigMergedSchema.parse(mergedConfig);
  } catch (error) {
    rethrowValidationErrorIfZodError(error, 'Invalid merged config');
    throw error;
  }
};
