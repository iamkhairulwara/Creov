const DOMPurify = require('isomorphic-dompurify');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <style>body { color: red; }</style>
</head>
<body>
  <h1>Test</h1>
  <script>alert(1);</script>
</body>
</html>`;

const cleanHtml = DOMPurify.sanitize(html, {
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
  ADD_TAGS: ['style']
});

console.log(cleanHtml);
