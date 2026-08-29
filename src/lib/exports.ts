export function printDocument(title: string, html: string) {
  const frame = window.open('', '_blank', 'width=820,height=980');
  if (!frame) return;
  frame.document.write(`<!doctype html>
<html>
  <head>
    <title>${title}</title>
    <style>
      :root { color-scheme: light; }
      body {
        margin: 0;
        padding: 36px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        background: #f1f1eb;
        color: #050505;
      }
      h1 { font-size: 28px; letter-spacing: -0.05em; text-transform: uppercase; margin: 0 0 4px; }
      h2 { font-size: 14px; letter-spacing: 0.18em; text-transform: uppercase; color: #3d4a12; margin: 0 0 24px; }
      .bar { height: 8px; background: #c8ff16; margin-bottom: 24px; }
      table { width: 100%; border-collapse: collapse; margin-top: 16px; }
      th, td { text-align: left; padding: 8px 0; border-bottom: 1px solid #d5d5c8; font-size: 12px; }
      .muted { color: #555; font-size: 11px; }
      .total { font-size: 18px; font-weight: 800; }
      .pass {
        border: 2px solid #050505;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        gap: 24px;
        align-items: center;
        margin-top: 16px;
        background: white;
      }
      img.qr { width: 160px; height: 160px; background: #c8ff16; padding: 8px; }
      @media print { body { background: white; } }
    </style>
  </head>
  <body>
    <div class="bar"></div>
    ${html}
  </body>
</html>`);
  frame.document.close();
  frame.focus();
  setTimeout(() => frame.print(), 300);
}

export function downloadCsv(filename: string, headers: string[], rows: Array<Array<string | number>>) {
  const esc = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;
  const csv = [headers.map(esc).join(','), ...rows.map((row) => row.map(esc).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function formatInr(value: number) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}
