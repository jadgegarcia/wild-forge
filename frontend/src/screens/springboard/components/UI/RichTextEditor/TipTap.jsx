import { useEditor, EditorContent, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import React from 'react';
import { MdSubscript, MdSuperscript, MdHorizontalRule } from 'react-icons/md';
import { FiUnderline } from 'react-icons/fi';
import {
  BiBold,
  BiItalic,
  BiAlignJustify,
  BiAlignLeft,
  BiAlignMiddle,
  BiAlignRight,
  BiHighlight,
  BiTable,
  BiUndo,
  BiRedo,
} from 'react-icons/bi';
import {
  AiOutlineStrikethrough,
  AiOutlineOrderedList,
  AiOutlineUnorderedList,
} from 'react-icons/ai';
import {
  RiInsertColumnLeft,
  RiInsertColumnRight,
  RiDeleteColumn,
  RiInsertRowBottom,
  RiInsertRowTop,
  RiDeleteRow,
  RiMergeCellsHorizontal,
  RiLayoutColumnFill,
  RiLayoutRowFill,
  RiPaintFill,
  RiSplitCellsHorizontal,
  RiDeleteBinLine,
  RiH1,
  RiH2,
  RiH3,
} from 'react-icons/ri';
import './Tiptap.css';
import styles from './Tiptap.module.css';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  // const addImage = useCallback(() => {
  //   const url = window.prompt('URL');

  //   if (url) {
  //     editor.chain().focus().setImage({ src: url }).run();
  //   }
  // }, [editor]);

  return (
    <div className={styles.menuBar}>
      <div>
        <div className={styles.divSeparator}>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? `${styles.active} butHover` : 'butHover'}
          >
            <BiBold title="Bold" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? `${styles.active} butHover` : 'butHover'}
          >
            <BiItalic title="Italic" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? `${styles.active} butHover` : 'butHover'}
          >
            <FiUnderline title="Underline" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? `${styles.active} butHover` : 'butHover'}
          >
            <AiOutlineStrikethrough title="Strikethrough" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            className={editor.isActive('subscript') ? `${styles.active} butHover` : 'butHover'}
          >
            <MdSubscript title="Subscript" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            className={editor.isActive('superscript') ? `${styles.active} butHover` : 'butHover'}
          >
            <MdSuperscript title="Superscript" />
          </button>

          <input
            className={styles.inputColor}
            type="color"
            onInput={(event) => editor.chain().focus().setColor(event.target.value).run()}
            value={editor.getAttributes('textStyle').color}
            data-testid="setColor"
          />

          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={editor.isActive('highlight') ? `${styles.active} butHover` : 'butHover'}
          >
            <BiHighlight title="Highlight" />
          </button>
        </div>
        {/* <div className={styles.divSeparator}>
        <button class="butHover" onClick={toggleHeadings}>
          <div className={styles.heading}>
            <RiHeading /> <RiArrowDropDownFill />
          </div>
        </button>
      </div> */}

        <div className={`${styles.divSeparator} ${styles.headings}`}>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={
              editor.isActive('heading', { level: 1 }) ? `${styles.active} butHover` : 'butHover'
            }
          >
            <RiH1 title="Heading 1" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={
              editor.isActive('heading', { level: 2 }) ? `${styles.active} butHover` : 'butHover'
            }
          >
            <RiH2 title="Heading 2" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={
              editor.isActive('heading', { level: 3 }) ? `${styles.active} butHover` : 'butHover'
            }
          >
            <RiH3 title="Heading 3" />
          </button>
        </div>
        <div className={styles.divSeparator}>
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={
              editor.isActive({ textAlign: 'left' }) ? `${styles.active} butHover` : 'butHover'
            }
          >
            <BiAlignLeft title="Align Left" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={
              editor.isActive({ textAlign: 'center' }) ? `${styles.active} butHover` : 'butHover'
            }
          >
            <BiAlignMiddle title="Center" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={
              editor.isActive({ textAlign: 'right' }) ? `${styles.active} butHover` : 'butHover'
            }
          >
            <BiAlignRight title="Align Right" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={
              editor.isActive({ textAlign: 'justify' }) ? `${styles.active} butHover` : 'butHover'
            }
          >
            <BiAlignJustify title="Justify" />
          </button>
        </div>
        <div className={styles.divSeparator}>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? `${styles.active} butHover` : 'butHover'}
          >
            <AiOutlineUnorderedList title="Bullets" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? `${styles.active} butHover` : 'butHover'}
          >
            <AiOutlineOrderedList title="Numbering" />
          </button>
        </div>
        {/* <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? `${styles.active} butHover` : "butHover"}
        >
          <MdFormatQuote />
        </button> */}
        <div className={styles.divSeparator}>
          <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <MdHorizontalRule title="Horizontal Rule" />
          </button>

          {/* <button onClick={addImage} className="butHover">
            <LuImagePlus title="Insert Image" />
          </button> */}

          <button
            onClick={() => {
              editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
            }}
            className="butHover"
          >
            <BiTable title="Add a Table" />
          </button>

          {editor && (
            <FloatingMenu
              editor={editor}
              tippyOptions={{ duration: 100, placement: 'bottom-end' }}
              /* eslint-disable no-shadow */
              shouldShow={({ state }) => {
                // Check if the current selection contains a table
                if (state && state.doc && state.selection) {
                  const { from, to } = state.selection;
                  let hasTable = false;

                  state.doc.nodesBetween(from, to, (node) => {
                    if (node.type.name === 'table') {
                      hasTable = true;
                    }
                  });

                  return hasTable;
                }

                return false;
              }}
            >
              <div className={styles.floating}>
                <button
                  onClick={() => editor.chain().focus().addColumnBefore().run()}
                  className="butHover"
                >
                  <RiInsertColumnLeft title="Insert Left" />
                </button>
                <button
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                  className="butHover"
                >
                  <RiInsertColumnRight title="Insert Right" />
                </button>
                <button
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                  className="butHover"
                >
                  <RiDeleteColumn title="Delete Column" />
                </button>
                <button
                  onClick={() => editor.chain().focus().addRowBefore().run()}
                  className="butHover"
                >
                  <RiInsertRowTop title="Insert Above" />
                </button>
                <button
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                  className="butHover"
                >
                  <RiInsertRowBottom title="Insert Below" />
                </button>
                <button
                  onClick={() => editor.chain().focus().deleteRow().run()}
                  className="butHover"
                >
                  <RiDeleteRow title="Delete Column" />
                </button>
                <button
                  onClick={() => editor.chain().focus().deleteTable().run()}
                  className="butHover"
                >
                  <RiDeleteBinLine title="Delete Row" />
                </button>
                <button
                  onClick={() => editor.chain().focus().mergeCells().run()}
                  className="butHover"
                >
                  <RiMergeCellsHorizontal title="Merge Cells" />
                </button>
                <button
                  onClick={() => editor.chain().focus().splitCell().run()}
                  className="butHover"
                >
                  <RiSplitCellsHorizontal title="Split Cells" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
                  className="butHover"
                >
                  <RiLayoutColumnFill title="Fill Column" />
                </button>
                <button
                  className="butHover"
                  onClick={() => editor.chain().focus().toggleHeaderRow().run()}
                >
                  <RiLayoutRowFill title="Fill Row" />
                </button>
                <button
                  className="butHover"
                  onClick={() => editor.chain().focus().toggleHeaderCell().run()}
                >
                  <RiPaintFill title="Fill Cell" />
                </button>
              </div>
            </FloatingMenu>
          )}
        </div>
      </div>
      <div>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="childHover"
        >
          <BiUndo title="Undo" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="childHover"
        >
          <BiRedo title="Redo" />
        </button>
      </div>
    </div>
  );
};

export const Tiptap = ({ setDescription, value }) => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: 'myeditor',
      },
    },
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Table.configure({
        resizable: true,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),

      Underline,
      TableRow,
      TableHeader,
      TableCell,
      // Document,
      // Paragraph,
      // Text,
      // Heading,
      Subscript,
      Superscript,
      Color,
      TextStyle,
      // Gapcursor,
      // Image,
      // HorizontalRule,
    ],

    content: value,
    /* eslint-disable no-shadow */
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();

      // console.log(html);
      setDescription(html);
    },
  });

  return (
    <div className={styles.textEditor}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
