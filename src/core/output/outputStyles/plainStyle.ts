const PLAIN_SEPARATOR = "=".repeat(16);
const PLAIN_LONG_SEPARATOR = "=".repeat(64);

export const getPlainTemplate = () => {
  return `
{{#if headerText}}
{{{headerText}}}
{{/if}}

${PLAIN_LONG_SEPARATOR}
Files Structure
${PLAIN_LONG_SEPARATOR}
{{{treeString}}}

${PLAIN_LONG_SEPARATOR}
Repository Files
${PLAIN_LONG_SEPARATOR}

{{#each processedFiles}}
${PLAIN_SEPARATOR}
File: {{{this.path}}}
${PLAIN_SEPARATOR}
{{{this.content}}}

{{/each}}

{{#if instruction}}
${PLAIN_LONG_SEPARATOR}
Instruction
${PLAIN_LONG_SEPARATOR}
{{{instruction}}}
{{/if}}

`;
};
