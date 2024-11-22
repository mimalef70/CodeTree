import { z } from 'zod';
import { logger } from './logger.js';

export class CodeTreeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CodeTreeError';
  }
}

export class CodeTreeConfigValidationError extends CodeTreeError {
  constructor(message: string) {
    super(message);
    this.name = 'CodeTreeConfigValidationError';
  }
}

export const handleError = (error: unknown): void => {
  if (error instanceof CodeTreeError) {
    logger.error(`Error: ${error.message}`);
  } else if (error instanceof Error) {
    logger.error(`Unexpected error: ${error.message}`);
    logger.debug('Stack trace:', error.stack);
  } else {
    logger.error('An unknown error occurred');
  }

  logger.info('For more help, please visit: https://github.com/mimalef70/CodeTree/issues');
};

export const rethrowValidationErrorIfZodError = (error: unknown, message: string): void => {
  if (error instanceof z.ZodError) {
    const zodErrorText = error.errors.map((err) => `[${err.path.join('.')}] ${err.message}`).join('\n  ');
    throw new CodeTreeConfigValidationError(
      `${message}\n\n  ${zodErrorText}\n\n  Please check the config file and try again.`,
    );
  }
};
