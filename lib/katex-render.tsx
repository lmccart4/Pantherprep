"use client";

import katex from "katex";
import { Fragment } from "react";

const MATH_RE = /\$([^$]+)\$/g;
const CURRENCY_RE = /^\s*[\d,.]+\s*$/;
const WORD_RE = /\b[a-zA-Z]{3,}\b/;
const LATEX_CMD_RE = /\\[a-zA-Z]/;
const ALLOWED_TAGS =
  /^<\/?(b|i|em|strong|br|sup|sub|u|span|p|div|ul|ol|li|table|tr|td|th|thead|tbody|img|hr|code)\b[^>]*>$/i;

function isCurrency(inner: string): boolean {
  if (CURRENCY_RE.test(inner)) return true;
  if (WORD_RE.test(inner) && !LATEX_CMD_RE.test(inner)) return true;
  return false;
}

function sanitizeHtml(html: string): string {
  return html.replace(/<[^>]*>/g, (tag) =>
    ALLOWED_TAGS.test(tag) ? tag : tag.replace(/</g, "&lt;").replace(/>/g, "&gt;")
  );
}

export function renderMath(text: string | undefined | null): React.ReactNode {
  if (!text) return null;
  const s = String(text);
  const parts: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;

  // Reset regex
  MATH_RE.lastIndex = 0;

  while ((match = MATH_RE.exec(s)) !== null) {
    const inner = match[1];

    if (isCurrency(inner)) {
      // Skip — treat as literal text (including dollar signs)
      continue;
    }

    // Add text before this match
    if (match.index > last) {
      const before = s.slice(last, match.index);
      parts.push(renderHtmlSegment(before, `t${match.index}`));
    }

    // Render KaTeX
    try {
      const html = katex.renderToString(inner, { throwOnError: false });
      parts.push(
        <span
          key={`m${match.index}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch {
      parts.push(`$${inner}$`);
    }

    last = match.index + match[0].length;
  }

  // Remaining text
  if (last < s.length) {
    parts.push(renderHtmlSegment(s.slice(last), "tail"));
  }

  if (parts.length === 0) {
    return renderHtmlSegment(s, "full");
  }

  return <>{parts}</>;
}

function renderHtmlSegment(html: string, key: string): React.ReactNode {
  if (html.indexOf("<") >= 0) {
    return (
      <span
        key={key}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
      />
    );
  }
  return <Fragment key={key}>{html}</Fragment>;
}
