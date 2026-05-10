import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export async function exportAsZip({ html, css, js, filename = 'my-website' }) {
  const zip = new JSZip()

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>My Website</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>
${html}
<script src="script.js"></script>
</body>
</html>`

  zip.file('index.html', fullHtml)
  zip.file('style.css', css || '')
  zip.file('script.js', js || '')

  const blob = await zip.generateAsync({ type: 'blob' })
  saveAs(blob, `${filename}.zip`)
}