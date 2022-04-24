import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js';
import extractInterface from 'interface-extractor';

const Editor = styled.div`
  display: flex;
`;

const Source = styled.pre`
  height: ${function (props) {
    return props.height;
  }};
  max-height: ${function (props) {
    return props.height;
  }};
  width: calc(100vw - 90px);
  white-space: pre;
  word-wrap: normal;
  overflow-y: scroll;
  overflow-x: auto;
  box-sizing: border-box;
  line-height: 1.25rem;
  margin: 0;

  &:focus {
    outline: 0;
  }
`;

const LineNumbers = styled.ul`
  line-height: 1.25rem;
  list-style-type: none;
  text-align: right;
  font-family: monospace;
  color: rgba(255, 255, 255, 0.7);
  padding-inline-start: 0;
  width: 50px;
  padding: 0 10px 0 0;
  margin: 0 30px 0 0;
  overflow: hidden;
  min-width: ${function (props) {
    return props.width || '2vh';
  }};
  min-height: ${function (props) {
    return props.height;
  }};
  max-height: ${function (props) {
    return props.height;
  }};
`;

const Author = function ({ headerHeight }) {
  const [source, setSource] = useState('');
  const position = useRef();
  const [top, setTop] = useState();
  const sourceRef = useRef();
  const linesRef = useRef();

  const lines = source.split(/\r*\n/).length;

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
      if (top !== undefined) {
        sourceRef.current.scrollTo({ top });
      }

      const extract = async function () {
        await extractInterface('Test', sourceRef.current.innerText);
      };
      extract();

      setCaretPosition(sourceRef.current, position.current);

      sourceRef.current.focus();
    },
    [source, top]
  );

  return (
    <Editor>
      <LineNumbers ref={linesRef} height={`calc(100vh - ${headerHeight}px)`}>
        {[...Array(lines)].map((_, i) => (
          <li key={i}>{i + 1}</li>
        ))}
      </LineNumbers>
      <Source
        contentEditable={true}
        height={`calc(100vh - ${headerHeight}px)`}
        spellCheck={false}
        onScroll={() => {
          linesRef.current.scrollTop = sourceRef.current.scrollTop;
        }}
        onInput={function () {
          setTop(sourceRef.current.scrollTop);
          position.current = getCaretCharacterOffsetWithin(sourceRef.current);
          setSource(hljs.highlight(sourceRef.current.innerText, { language: 'cpp' }).value);
          sourceRef.current.blur();
        }}
        onKeyDown={function (event) {
          if (event.code === 'Enter') {
            event.preventDefault();
            const docFragment = document.createDocumentFragment();
            const newEle = document.createElement('br');
            docFragment.appendChild(newEle);
            if (lines <= 1) {
              const newEle2 = document.createElement('br');
              docFragment.appendChild(newEle2);
            }
            let range = window.getSelection().getRangeAt(0);
            range.deleteContents();
            range.insertNode(docFragment);
            setTop(undefined);
            newEle.scrollIntoView();
            range = document.createRange();
            range.setStartAfter(newEle);
            range.collapse(true);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);

            const preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(sourceRef.current);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            position.current = preCaretRange.toString().length + 1;
            setSource(hljs.highlight(sourceRef.current.innerText, { language: 'cpp' }).value);
            sourceRef.current.blur();
          }
          if (event.code === 'Tab') {
            event.preventDefault();
            document.execCommand('insertText', false, '    ');
          }
        }}
        onPaste={function (event) {
          event.preventDefault();
          position.current = getCaretCharacterOffsetWithin(sourceRef.current);
          document.execCommand('insertHTML', false, event.clipboardData.getData('text/plain'));
          setSource(hljs.highlight(sourceRef.current.innerText, { language: 'cpp' }).value);
          sourceRef.current.blur();
        }}
        ref={sourceRef}
        dangerouslySetInnerHTML={{ __html: source }}
      ></Source>
    </Editor>
  );
};

export default Author;
