import pc from 'picocolors';
import type { CodeTreeConfigMerged } from '../config/configSchema.js';
import { logger } from '../shared/logger.js';

export const printSummary = (
  totalFiles: number,
  totalCharacters: number,
  totalTokens: number,
  outputPath: string,
  config: CodeTreeConfigMerged,
) => {

  logger.log(pc.white('📊 Pack Summary:'));
  logger.log(pc.dim('────────────────'));
  logger.log(`${pc.white('  Total Files:')} ${pc.white(totalFiles.toString())}`);
  logger.log(`${pc.white('  Total Chars:')} ${pc.white(totalCharacters.toString())}`);
  logger.log(`${pc.white(' Total Tokens:')} ${pc.white(totalTokens.toString())}`);
  logger.log(`${pc.white('       Output:')} ${pc.white(outputPath)}`);
};

export const printTopFiles = (
  fileCharCounts: Record<string, number>,
  fileTokenCounts: Record<string, number>,
  topFilesLength: number,
) => {
  logger.log(pc.white(`📈 Top ${topFilesLength} Files by Character Count and Token Count:`));
  logger.log(pc.dim('──────────────────────────────────────────────────────'));

  const topFiles = Object.entries(fileCharCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topFilesLength);

  topFiles.forEach(([filePath, charCount], index) => {
    const tokenCount = fileTokenCounts[filePath];
    const indexString = `${index + 1}.`.padEnd(3, ' ');
    logger.log(
      `${pc.white(`${indexString}`)} ${pc.white(filePath)} ${pc.dim(`(${charCount} chars, ${tokenCount} tokens)`)}`,
    );
  });
};

export const printCompletion = () => {
  logger.log(pc.green('🎉 All Done!'));
  logger.log(pc.white('Your repository has been successfully packed.'));
};
