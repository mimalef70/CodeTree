import { globby } from 'globby';
import type { CodeTreeConfigMerged } from '../../config/configSchema.js';
import { defaultIgnoreList } from '../../config/defaultIgnore.js';
import { logger } from '../../shared/logger.js';
import { sortPaths } from './filePathSort.js';
import { PermissionError, checkDirectoryPermissions } from './permissionCheck.js';

export const searchFiles = async (rootDir: string, config: CodeTreeConfigMerged): Promise<string[]> => {
  // First check directory permissions
  const permissionCheck = await checkDirectoryPermissions(rootDir);

  if (!permissionCheck.hasPermission) {
    if (permissionCheck.error instanceof PermissionError) {
      throw permissionCheck.error;
    }
    throw new Error(`Cannot access directory ${rootDir}: ${permissionCheck.error?.message}`);
  }

  const includePatterns = config.include.length > 0 ? config.include : ['**/*'];

  try {
    const [ignorePatterns, ignoreFilePatterns] = await Promise.all([
      getIgnorePatterns(rootDir, config),
      getIgnoreFilePatterns(config),
    ]);

    logger.trace('Include patterns:', includePatterns);
    logger.trace('Ignore patterns:', ignorePatterns);
    logger.trace('Ignore file patterns:', ignoreFilePatterns);

    const filePaths = await globby(includePatterns, {
      cwd: rootDir,
      ignore: [...ignorePatterns],
      ignoreFiles: [...ignoreFilePatterns],
      onlyFiles: true,
      absolute: false,
      dot: true,
      followSymbolicLinks: false,
    }).catch((error) => {
      // Handle EPERM errors specifically
      if (error.code === 'EPERM' || error.code === 'EACCES') {
        throw new PermissionError(
          'Permission denied while scanning directory. Please check folder access permissions for your terminal app.',
          rootDir,
        );
      }
      throw error;
    });

    logger.trace(`Filtered ${filePaths.length} files`);
    const sortedPaths = sortPaths(filePaths);

    return sortedPaths;
  } catch (error: unknown) {
    // Re-throw PermissionError as is
    if (error instanceof PermissionError) {
      throw error;
    }

    if (error instanceof Error) {
      logger.error('Error filtering files:', error.message);
      throw new Error(`Failed to filter files in directory ${rootDir}. Reason: ${error.message}`);
    }

    logger.error('An unexpected error occurred:', error);
    throw new Error('An unexpected error occurred while filtering files.');
  }
};

export const parseIgnoreContent = (content: string): string[] => {
  if (!content) return [];

  return content.split('\n').reduce<string[]>((acc, line) => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      acc.push(trimmedLine);
    }
    return acc;
  }, []);
};

export const getIgnoreFilePatterns = async (config: CodeTreeConfigMerged): Promise<string[]> => {
  const ignoreFilePatterns: string[] = [];

  if (config.ignore.useGitignore) {
    ignoreFilePatterns.push('**/.gitignore');
  }

  ignoreFilePatterns.push('**/.codetreeignore');

  return ignoreFilePatterns;
};

export const getIgnorePatterns = async (rootDir: string, config: CodeTreeConfigMerged): Promise<string[]> => {
  const ignorePatterns = new Set<string>();

  // Add default ignore patterns
  if (config.ignore.useDefaultPatterns) {
    logger.trace('Adding default ignore patterns');
    for (const pattern of defaultIgnoreList) {
      ignorePatterns.add(pattern);
    }
  }

  // Add codetree output file
  if (config.output.filePath) {
    logger.trace('Adding output file to ignore patterns:', config.output.filePath);
    ignorePatterns.add(config.output.filePath);
  }

  // Add custom ignore patterns
  if (config.ignore.customPatterns) {
    logger.trace('Adding custom ignore patterns:', config.ignore.customPatterns);
    for (const pattern of config.ignore.customPatterns) {
      ignorePatterns.add(pattern);
    }
  }

  return Array.from(ignorePatterns);
};
