import { useState } from "react";
import "./App.css";

function cleanHTML(rawHTML: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHTML, "text/html");

  // Xoá rác
  const removeSelectors =
    "script, style, noscript, iframe, header, footer, nav, aside, .ad, .ads, .banner";
  doc.querySelectorAll(removeSelectors).forEach((el) => el.remove());

  // Lấy nội dung chính
  let text = "";
  const entry =
    doc.querySelector(
      ".entry-content, .post-content, .content, article, #content",
    ) || doc.body;

  text = (entry as HTMLElement)?.innerText || "";
  return text.replace(/\s+/g, " ").trim();
}

function splitTextByWords(text: string, maxWords = 700): string[] {
  const sentences = text
    .split(".")
    .map((s) => s.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current = "";
  let count = 0;

  for (const sentence of sentences) {
    const words = sentence.split(/\s+/).length;

    if (count + words > maxWords && current) {
      chunks.push(current.trim() + ".");
      current = "";
      count = 0;
    }

    current += sentence + ". ";
    count += words;
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}

export default function App() {
  const [html, setHtml] = useState("");
  const [output, setOutput] = useState("");

  const handleClean = () => {
    const result = cleanHTML(html);
    if (!result || result.length < 20) {
      alert("⚠️ Không lấy được nội dung chính.");
      return;
    }
    setOutput(result);
  };

  const downloadFile = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `clean_text_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const downloadSplitFiles = () => {
    const parts = splitTextByWords(output, 700);

    parts.forEach((text, i) => {
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `clean_part_${i + 1}.txt`;
      a.click();

      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="app-container">
      <div className="container">
        <h1>HTML → TEXT CLEANER</h1>

        <textarea
          placeholder="Paste HTML vào đây..."
          value={html}
          onChange={(e) => setHtml(e.target.value)}
        />

        <button onClick={handleClean}>Lọc HTML</button>

        <h3>Kết quả:</h3>
        <pre>{output}</pre>

        {output && (
          <div className="btn-group">
            <button className="download" onClick={downloadFile}>
              ⬇️ Tải 1 file
            </button>

            <button className="download" onClick={downloadSplitFiles}>
              📂 Tải nhiều file (700 từ)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
