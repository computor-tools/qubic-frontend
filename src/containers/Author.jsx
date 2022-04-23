import styled from '@emotion/styled';
import React, { useRef, useState } from 'react';
import { toHtml } from 'hast-util-to-html';
import { lowlight } from 'lowlight';
import cpp from 'highlight.js/lib/languages/cpp.js';

lowlight.registerLanguage('cpp', cpp);

const getCursorPos = function (input) {
  if ('selectionStart' in input && document.activeElement == input) {
    return {
      start: input.selectionStart,
      end: input.selectionEnd,
    };
  } else if (input.createTextRange) {
    var sel = document.selection.createRange();
    if (sel.parentElement() === input) {
      var rng = input.createTextRange();
      rng.moveToBookmark(sel.getBookmark());
      for (var len = 0; rng.compareEndPoints('EndToStart', rng) > 0; rng.moveEnd('character', -1)) {
        len++;
      }
      rng.setEndPoint('StartToStart', input.createTextRange());
      for (
        var pos = { start: 0, end: len };
        rng.compareEndPoints('EndToStart', rng) > 0;
        rng.moveEnd('character', -1)
      ) {
        pos.start++;
        pos.end++;
      }
      return pos;
    }
  }
  return -1;
};

const setCursorPos = function (input, start, end) {
  if (arguments.length < 3) end = start;
  if ('selectionStart' in input) {
    setTimeout(function () {
      input.selectionStart = start;
      input.selectionEnd = end;
    }, 1);
  } else if (input.createTextRange) {
    var rng = input.createTextRange();
    rng.moveStart('character', start);
    rng.collapse();
    rng.moveEnd('character', end - start);
    rng.select();
  }
};

const handleTab = function (ref) {
  const TAB = {
    char: ' ',
    size: 2,
  };
  const { end } = getCursorPos(ref.current);
  const result = insertAtCursorPos(ref.current.value, end, 0, TAB.char);
  ref.current.value = result;
  setCursorPos(ref.current, end + TAB.size);
  return result;
};

const Editor = styled.pre`
  min-height: ${function (props) {
    return props.minHeight;
  }};
  line-height: 1.25rem;
  height: 100%;
  white-space: pre;
  word-wrap: normal;
  overflow-x: auto;
  margin: 0;
  box-sizing: border-box;
  padding: 2vh;
`;

const Source = styled.textarea`
  min-height: ${function (props) {
    return props.minHeight;
  }};
  height: 100%;
  position: absolute;
  line-height: 1.25rem;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0);
  color: rgba(255, 255, 255, 0);
  caret-color: white;
  resize: none;
  width: 100%;
  white-space: pre;
  word-wrap: normal;
  overflow-x: auto;
  box-sizing: border-box;
  padding: 2vh;
  letter-spacing: -0.015em;
  margin: 0;
  &::selection {
    color: rgba(255, 255, 255, 0);
    background: rgba(0, 100, 255, 0.3);
  }
  border: unset;
  &:active,
  &:focus-visible,
  &:focus-within,
  &:focus {
    border: unset;
    outline: none;
  }
`;

const insertAtCursorPos = function (val, idx, rem, str) {
  return val.slice(0, idx) + str + val.slice(idx + Math.abs(rem));
};

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  display: ${function (props) {
    return props.display || 'block';
  }};
  width: ${function (props) {
    return props.width;
  }};
  min-width: ${function (props) {
    return props.minWidth;
  }};
  overflow: ${function (props) {
    return props.overflow;
  }};
`;
const LineNumbers = styled.ul`
  line-height: 1.25rem;
  list-style-type: none;
  text-align: right;
  margin-top: 0;
  padding: 2vh 1ch 2vh 0;
  font-family: monospace;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.1);
  padding-inline-start: 0;
  min-width: ${function (props) {
    return props.width || '2ch';
  }};
  min-height: ${function (props) {
    return props.minHeight || 'inherit';
  }};
`;

const Author = function ({ headerHeight }) {
  const [source, setSource] = useState('');
  const sourceRef = useRef();
  const editorRef = useRef();
  const linesRef = useRef();

  const lines = source.split(/\r*\n/).length + 1;
  return (
    <Wrapper display="flex" witdh="100%">
      <Wrapper minWidth={`${lines.toString().length + 2}ch`} overflow="hidden auto">
        <LineNumbers ref={linesRef} minHeight={`calc(100vh - ${headerHeight}px - 8vh)`}>
          {[...Array(lines)].map((_, i) => (
            <li key={i}>{i + 1}</li>
          ))}
        </LineNumbers>
      </Wrapper>
      <Wrapper width="100%" overflow="hidden auto">
        <Source
          onScroll={() => {
            editorRef.current.scrollLeft = sourceRef.current.scrollLeft;
            editorRef.current.scrollTop = sourceRef.current.scrollTop;
            linesRef.current.scrollTop = sourceRef.current.scrollTop;
          }}
          minHeight={`calc(100vh - ${headerHeight}px - 4vh)`}
          spellCheck={false}
          onChange={function (event) {
            setSource(event.target.value);
          }}
          onKeyDown={function (event) {
            if (event.code === 'Tab') {
              event.preventDefault();
              const nextSource = handleTab(sourceRef);
              setSource(nextSource);
            }
          }}
          ref={sourceRef}
        />
        <Editor
          contentEditable={true}
          minHeight={`calc(100vh - ${headerHeight}px - 4vh)`}
          spellCheck={false}
          ref={editorRef}
          dangerouslySetInnerHTML={{ __html: toHtml(lowlight.highlight('cpp', source)) }}
        ></Editor>
      </Wrapper>
    </Wrapper>
  );
};

export default Author;
