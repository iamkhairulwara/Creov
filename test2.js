const s = require('sanitize-html');
console.log(s('<div><script>alert(1)</script><p class="foo">test</p></div>', {
  allowedTags: false,
  allowedAttributes: false,
  exclusiveFilter: function(frame) {
    return ['script', 'iframe', 'object', 'embed', 'form'].includes(frame.tag);
  }
}));
