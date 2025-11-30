import { useEffect, useRef, useState } from "react";

const SYNTAX_THEME = {
  "::": { color: "#fcfcfa7f", bold: false },
  "%%%": { color: "#f9d36f", bold: false },
  "#": { color: "#ab9df2", bold: true },
  "[ ]": { color: "#a9dc76", bold: false },
  "[X]": { color: "#a9dc76", bold: true },
  "!": { color: "#ff6188", bold: false },
  "*": { color: "#78dce8", bold: false },
  default: { color: "#fcfcfa", bold: false },
};

const STORAGE_KEY = "firequill-notes-v1";

function highlightText(text) {
  return text
    .split("\n")
    .map((line) => {
      const trimmed = line.trimStart();
      let rule = SYNTAX_THEME.default;

      if (/^::/.test(trimmed)) rule = SYNTAX_THEME["::"];
      else if (/^%%%/.test(trimmed)) rule = SYNTAX_THEME["%%%"];
      else if (/^\[X\]/i.test(trimmed)) rule = SYNTAX_THEME["[X]"];
      else if (/^\[\s\]/.test(trimmed)) rule = SYNTAX_THEME["[ ]"];
      else if (/^#/.test(trimmed)) rule = SYNTAX_THEME["#"];
      else if (/^!/.test(trimmed)) rule = SYNTAX_THEME["!"];
      else if (/^\*/.test(trimmed)) rule = SYNTAX_THEME["*"];

      const color = rule.color;
      const fontWeight = rule.bold ? "bold" : "normal";

      const escaped = line
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/ /g, "&nbsp;");

      return `<div><span style="color:${color}; font-weight:${fontWeight}">${
        escaped || "&nbsp;"
      }</span></div>`;
    })
    .join("");
}

export default function Editor() {
  const editorRef = useRef(null);
  const highlightedRef = useRef(null);

  // 🔹 Initialize from localStorage ONCE
  const [text, setText] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      return window.localStorage.getItem(STORAGE_KEY) ?? "";
    } catch {
      return "";
    }
  });

  // 🔹 Save to localStorage whenever text changes
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, text);
    } catch {
      // ignore quota / private mode issues
    }
  }, [text]);

  const handleScroll = () => {
    if (!editorRef.current || !highlightedRef.current) return;
    highlightedRef.current.scrollTop = editorRef.current.scrollTop;
    highlightedRef.current.scrollLeft = editorRef.current.scrollLeft;
  };

  const handleKeyDown = (e) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const value = textarea.value;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const lines = value.split("\n");

    let charCount = 0;
    let startLine = 0;
    let endLine = 0;

    for (let i = 0; i < lines.length; i++) {
      const lineLength = lines[i].length + 1;
      if (charCount + lineLength > start && startLine === 0) startLine = i;
      if (charCount + lineLength >= end) {
        endLine = i;
        break;
      }
      charCount += lineLength;
    }

    const indent = "  ";

    // TAB
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();

      if (start === end) {
        textarea.value = value.slice(0, start) + indent + value.slice(end);
        textarea.selectionStart = textarea.selectionEnd = start + indent.length;
      } else {
        for (let i = startLine; i <= endLine; i++) {
          lines[i] = indent + lines[i];
        }
        textarea.value = lines.join("\n");
        const linesAffected = endLine - startLine + 1;
        textarea.selectionStart = start + indent.length;
        textarea.selectionEnd = end + indent.length * linesAffected;
      }

      setText(textarea.value);
    }

    // SHIFT+TAB
    else if (e.key === "Tab" && e.shiftKey) {
      e.preventDefault();

      let removedCount = 0;
      for (let i = startLine; i <= endLine; i++) {
        if (lines[i].startsWith(indent)) {
          lines[i] = lines[i].slice(indent.length);
          removedCount++;
        } else if (lines[i].startsWith(" ")) {
          const match = lines[i].match(/^ +/);
          if (match) {
            const spacesToRemove = Math.min(match[0].length, indent.length);
            lines[i] = lines[i].slice(spacesToRemove);
            removedCount++;
          }
        }
      }

      textarea.value = lines.join("\n");
      textarea.selectionStart = Math.max(start - indent.length, 0);
      textarea.selectionEnd = end - indent.length * removedCount;

      setText(textarea.value);
    }

    // ENTER with auto-indent
    else if (e.key === "Enter") {
      e.preventDefault();

      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const currentLine = value.substring(lineStart, start);
      const indentMatch = currentLine.match(/^[ \t]*/);
      const currentIndent = indentMatch ? indentMatch[0] : "";

      const insert = "\n" + currentIndent;
      textarea.value = value.slice(0, start) + insert + value.slice(end);
      textarea.selectionStart = textarea.selectionEnd = start + insert.length;

      setText(textarea.value);
    }
  };

  return (
    <div className="editor-container">
      <div
        ref={highlightedRef}
        className="highlighted"
        dangerouslySetInnerHTML={{ __html: highlightText(text) }}
      />
      <textarea
        ref={editorRef}
        className="editor"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        spellCheck="false"
      />
    </div>
  );
}