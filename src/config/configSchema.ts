import { z } from 'zod';

// Output style enum
export const codetreeOutputStyleSchema = z.enum(['plain', 'xml', 'markdown']);
export type CodeTreeOutputStyle = z.infer<typeof codetreeOutputStyleSchema>;

// Default values map
export const defaultFilePathMap: Record<CodeTreeOutputStyle, string> = {
  plain: 'codetree.txt',
  markdown: 'codetree.md',
  xml: 'codetree.xml',
} as const;

// Base config schema
export const codetreeConfigBaseSchema = z.object({
  output: z
    .object({
      filePath: z.string().optional(),
      style: codetreeOutputStyleSchema.optional(),
      headerText: z.string().optional(),
      instructionFilePath: z.string().optional(),
      removeComments: z.boolean().optional(),
      removeEmptyLines: z.boolean().optional(),
      topFilesLength: z.number().optional(),
      showLineNumbers: z.boolean().optional(),
      copyToClipboard: z.boolean().optional(),
    })
    .optional(),
  include: z.array(z.string()).optional(),
  ignore: z
    .object({
      useGitignore: z.boolean().optional(),
      useDefaultPatterns: z.boolean().optional(),
      customPatterns: z.array(z.string()).optional(),
    })
    .optional(),
});

// Default config schema with default values
export const codetreeConfigDefaultSchema = z.object({
  output: z
    .object({
      filePath: z.string().default(defaultFilePathMap.plain),
      style: codetreeOutputStyleSchema.default('plain'),
      headerText: z.string().optional(),
      instructionFilePath: z.string().optional(),
      removeComments: z.boolean().default(false),
      removeEmptyLines: z.boolean().default(false),
      topFilesLength: z.number().int().min(0).default(5),
      showLineNumbers: z.boolean().default(false),
      copyToClipboard: z.boolean().default(false),
    })
    .default({}),
  include: z.array(z.string()).default([]),
  ignore: z
    .object({
      useGitignore: z.boolean().default(true),
      useDefaultPatterns: z.boolean().default(true),
      customPatterns: z.array(z.string()).default([]),
    })
    .default({}),
});

export const codetreeConfigFileSchema = codetreeConfigBaseSchema;

export const codetreeConfigCliSchema = codetreeConfigBaseSchema;

export const codetreeConfigMergedSchema = codetreeConfigDefaultSchema
  .and(codetreeConfigFileSchema)
  .and(codetreeConfigCliSchema)
  .and(
    z.object({
      cwd: z.string(),
    }),
  );

export type CodeTreeConfigDefault = z.infer<typeof codetreeConfigDefaultSchema>;
export type CodeTreeConfigFile = z.infer<typeof codetreeConfigFileSchema>;
export type CodeTreeConfigCli = z.infer<typeof codetreeConfigCliSchema>;
export type CodeTreeConfigMerged = z.infer<typeof codetreeConfigMergedSchema>;

export const defaultConfig = codetreeConfigDefaultSchema.parse({});
