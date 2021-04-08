import * as React from 'react';

export interface IRichTextComponentProps {
  html: string;
  intro?: boolean;
}

function RichText({ html, intro }: IRichTextComponentProps) {
  return <div className={`richtext ${intro ? 'richtext-intro py-0' : 'px-4 lg:px-0'} my-8`} dangerouslySetInnerHTML={{ __html: html }} />;
}

export default RichText;
