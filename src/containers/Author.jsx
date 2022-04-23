import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react';
import { toHtml } from 'hast-util-to-html';
import { lowlight } from 'lowlight';
import cpp from 'highlight.js/lib/languages/cpp.js';
import { privateKey } from 'qubic-js/src/identity';

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
    var range = document.createRange();
    var sel = window.getSelection();

    //select appropriate node
    var currentNode = null;
    var previousNode = null;

    for (var i = 0; i < element.childNodes.length; i++) {
      //save previous node
      previousNode = currentNode;

      //get current node
      currentNode = element.childNodes[i];
      //if we get span or something else then we should get child node
      while (currentNode.childNodes.length > 0) {
        currentNode = currentNode.childNodes[0];
      }

      //calc offset in current node
      if (previousNode != null) {
        offset -= previousNode.length;
      }
      //check whether current node has enough length
      if (offset <= currentNode.length) {
        break;
      }
    }

    //move caret to specified offset
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

  useEffect(
    function () {
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
        document.execCommand('insertHTML', false, event.clipboardData.getData('text/plain'));
        setPosition(getCaretCharacterOffsetWithin(sourceRef.current));
        setSource(toHtml(lowlight.highlight('cpp', sourceRef.current.innerText)));
      }}
      ref={sourceRef}
      dangerouslySetInnerHTML={{ __html: source }}
    ></Editor>
  );
};

export default Author;
