// __mocks__/react-textarea-code-editor.js

const React = require('react');

const CodeEditorMock = React.forwardRef((props, ref) => {
  return React.createElement('textarea', { ref, ...props });
});

module.exports = CodeEditorMock;