import styled from '@emotion/styled';
import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { toHtml } from 'hast-util-to-html';
import { lowlight } from 'lowlight';
import cpp from 'highlight.js/lib/languages/cpp.js';
import extractInterface from 'interface-extractor';

lowlight.registerLanguage('cpp', cpp);

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
    let currentNode = undefined;
    let previousNode = undefined;
    let i = 0;
    while (i < nodesToAnalyze.length) {
      currentNode = nodesToAnalyze[i++];

      if (currentNode.childNodes.length > 0) {
        for (let j = 0; j < currentNode.childNodes.length; j++) {
          nodesToAnalyze.splice(i + j, 0, currentNode.childNodes[j]);
        }
      } else {
        if (previousNode !== undefined) {
          offset -= previousNode.length;
        }

        if (offset <= currentNode.length) {
          break;
        }
        previousNode = currentNode;
      }
    }

    const range = document.createRange();
    const sel = window.getSelection();
    if (currentNode != null) {
      range.setStart(currentNode, offset);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  useEffect(function () {
    sourceRef.current.focus();
  }, []);

  useLayoutEffect(
    function () {
      console.log(position);
      setCaretPosition(sourceRef.current, position);
      console.log(extractInterface('test', sourceRef.current.innerText));
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
        setSource(toHtml(lowlight.highlight('cpp', sourceRef.current.innerText)));
      }}
      onKeyDown={function (event) {
        if (event.code === 'Tab') {
          event.preventDefault();
          document.execCommand('insertText', false, '    ');
        }
      }}
      onPaste={function (event) {
        event.preventDefault();
        setPosition(getCaretCharacterOffsetWithin(sourceRef.current));
        document.execCommand('insertHTML', false, event.clipboardData.getData('text/plain'));
        setSource(toHtml(lowlight.highlight('cpp', sourceRef.current.innerText)));
      }}
      ref={sourceRef}
      dangerouslySetInnerHTML={{ __html: source }}
    ></Editor>
  );
};

export default Author;
