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

  text = entry?.innerText || "";

  return text.replace(/\s+/g, " ").trim();
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
          <button className="download" onClick={downloadFile}>
            ⬇️ Tải file TXT
          </button>
        )}
      </div>
    </div>
  );
}
