import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js';
import extractInterface from 'interface-extractor';

const Editor = styled.pre`
  height: ${function (props) {
    return props.height;
  }};
  white-space: pre;
  word-wrap: normal;
  overflow-x: auto;
  box-sizing: border-box;
  padding: 2vh;
`;

const Author = function ({ headerHeight }) {
  const [source, setSource] = useState();
  const [position, setPosition] = useState();
  const sourceRef = useRef();

  // Source: https://stackoverflow.com/a/4812022/6180136
  const getCaretCharacterOffsetWithin = function (element) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != 'undefined') {
      sel = win.getSelection();
      if (sel.rangeCount > 0) {
        var range = win.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
      }
    } else if ((sel = doc.selection) && sel.type != 'Control') {
      var textRange = sel.createRange();
      var preCaretTextRange = doc.body.createTextRange();
      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint('EndToEnd', textRange);
      caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
  };

  const setCaretPosition = function (element, offset) {
    const nodesToAnalyze = Array.from(element.childNodes);
    let node = undefined;
    let prevNode = undefined;
    let i = 0;
    while (i < nodesToAnalyze.length) {
      node = nodesToAnalyze[i++];

      if (node.childNodes.length > 0) {
        for (let j = 0; j < node.childNodes.length; j++) {
          nodesToAnalyze.splice(i + j, 0, node.childNodes[j]);
        }
      } else {
        if (prevNode !== undefined) {
          offset -= prevNode.length;
        }

        if (offset <= node.length) {
          break;
        }
        prevNode = node;
      }
    }

    const range = document.createRange();
    const sel = window.getSelection();
    if (node !== undefined) {
      range.setStart(node, offset);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  useEffect(function () {
    sourceRef.current.focus();
  }, []);

  useEffect(
    function () {
      console.log(position);
      setCaretPosition(sourceRef.current, position);
    },
    [source]
  );

  return (
    <Editor
      contentEditable={true}
      height={`calc(100vh - ${headerHeight}px - 4vh)`}
      spellCheck={false}
      onInput={function () {
        setPosition(getCaretCharacterOffsetWithin(sourceRef.current));
        setSource(hljs.highlight(sourceRef.current.innerText, { language: 'cpp' }).value);
      }}
      onKeyDown={function (event) {
        console.log(event.code);
        if (event.code === 'Enter') {
          event.preventDefault();
          const docFragment = document.createDocumentFragment();
          const newEle = document.createElement('br');
          docFragment.appendChild(newEle);
          let range = window.getSelection().getRangeAt(0);
          range.deleteContents();
          range.insertNode(docFragment);
          range = document.createRange();
          range.setStartAfter(newEle);
          range.collapse(true);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);

          const preCaretRange = range.cloneRange();
          preCaretRange.selectNodeContents(sourceRef.current);
          preCaretRange.setEnd(range.endContainer, range.endOffset);
          setPosition(preCaretRange.toString().length + 1);
          setSource(hljs.highlight(sourceRef.current.innerText, { language: 'cpp' }).value);
        }
        if (event.code === 'Tab') {
          event.preventDefault();
          document.execCommand('insertText', false, '    ');
        }
      }}
      onPaste={function (event) {
        event.preventDefault();
        setPosition(getCaretCharacterOffsetWithin(sourceRef.current));
        document.execCommand('insertHTML', false, event.clipboardData.getData('text/plain'));
        setSource(hljs.highlight(sourceRef.current.innerText, { language: 'cpp' }).value);
      }}
      ref={sourceRef}
      dangerouslySetInnerHTML={{ __html: source }}
    ></Editor>
  );
};

export default Author;
