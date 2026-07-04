import React from 'react';
import { CodeBlock } from '@castui/cast-ui';

/** Static code sample rendered with the library's own CodeBlock. */
export function CodeSnippet({
  code,
  title,
  language = 'tsx',
}: {
  code: string;
  title?: string;
  language?: string;
}) {
  return (
    <CodeBlock size="small" language={language} title={title} showLineNumbers={false}>
      {code.trim()}
    </CodeBlock>
  );
}
