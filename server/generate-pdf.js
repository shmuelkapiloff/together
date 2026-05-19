const fs = require('fs');
const path = require('path');

// Simple markdown to HTML converter
function markdownToHtml(md) {
    let html = md;
    
    // Headers
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    // Line breaks for paragraphs
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    
    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p><h/g, '<h');
    html = html.replace(/<\/h[1-3]><\/p>/g, '</h>');
    
    return html;
}

// Read markdown
const mdFilePath = path.join(__dirname, 'docs/guides/FINAL_PROJECT_BOOK_HE.md');
const mdContent = fs.readFileSync(mdFilePath, 'utf-8');

// Convert to HTML
const htmlBody = markdownToHtml(mdContent);

// Create HTML document
const htmlDoc = `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ספר פרויקט גמר - Simple Shop</title>
    <style>
        * { direction: rtl; }
        body {
            font-family: 'Segoe UI', 'Arial', sans-serif;
            line-height: 1.8;
            color: #333;
            margin: 20px;
            padding: 0;
        }
        h1 { 
            page-break-before: always;
            border-bottom: 2px solid #0066cc;
            padding-bottom: 10px;
            color: #0066cc;
            margin-top: 40px;
        }
        h1:first-of-type { page-break-before: avoid; }
        h2 { color: #0066cc; margin-top: 25px; }
        code { 
            background: #f5f5f5;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        pre {
            background: #f5f5f5;
            padding: 12px;
            border-left: 3px solid #0066cc;
            overflow-x: auto;
            border-radius: 4px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        th {
            background: #0066cc;
            color: white;
            padding: 10px;
            text-align: right;
        }
        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: right;
        }
        tr:nth-child(even) { background: #f9f9f9; }
        a { color: #0066cc; text-decoration: none; }
        blockquote {
            border-left: 4px solid #0066cc;
            padding-left: 12px;
            color: #666;
            margin-left: 0;
        }
        hr { border: none; border-top: 2px solid #0066cc; margin: 30px 0; }
    </style>
</head>
<body>
${htmlBody}
</body>
</html>`;

// Save HTML
const htmlPath = path.join(__dirname, 'docs/guides/FINAL_PROJECT_BOOK_HE.html');
fs.writeFileSync(htmlPath, htmlDoc, 'utf-8');
console.log('✓ HTML file created at:', htmlPath);
console.log('\nNext steps:');
console.log('1. Open the HTML file in a browser');
console.log('2. Use Ctrl+P (or Cmd+P) to print');
console.log('3. Select "Save as PDF"');
console.log('\nOr use this command if wkhtmltopdf is installed:');
console.log('wkhtmltopdf ' + htmlPath + ' ' + path.join(__dirname, 'docs/guides/FINAL_PROJECT_BOOK_HE.pdf'));
