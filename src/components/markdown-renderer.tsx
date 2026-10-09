'use client';

import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Simple, robust parser for medical instructional markdown
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: string[] = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc pl-6 space-y-1.5 my-3 text-slate-700 text-sm leading-relaxed">
          {listItems.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const formatInline = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-800">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded text-xs font-mono font-semibold border border-blue-200">$1</code>');
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={index} className="text-xl font-bold text-blue-950 mt-6 mb-3 border-b border-slate-200 pb-2">
          {trimmed.replace('### ', '')}
        </h3>
      );
    } else if (trimmed.startsWith('#### ')) {
      flushList();
      elements.push(
        <h4 key={index} className="text-base font-bold text-slate-800 mt-4 mb-2">
          {trimmed.replace('#### ', '')}
        </h4>
      );
    } else if (trimmed.startsWith('> ')) {
      // Clinical alert callout
      flushList();
      const alertText = trimmed.replace('> ', '');
      elements.push(
        <div
          key={index}
          className="my-4 p-4 rounded-xl bg-amber-50/80 border-l-4 border-amber-500 text-slate-800 text-sm shadow-xs"
        >
          <div dangerouslySetInnerHTML={{ __html: formatInline(alertText) }} />
        </div>
      );
    } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
      inList = true;
      const cleanItem = trimmed.replace(/^(\*|-|\d+\.)\s+/, '');
      listItems.push(cleanItem);
    } else {
      flushList();
      elements.push(
        <p
          key={index}
          className="text-sm text-slate-700 leading-relaxed my-2"
          dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
        />
      );
    }
  });

  flushList();

  return <div className="prose prose-slate max-w-none">{elements}</div>;
}
