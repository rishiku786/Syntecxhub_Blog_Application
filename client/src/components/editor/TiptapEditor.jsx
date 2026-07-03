import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

import {
  LuBold, LuItalic, LuUnderline, LuStrikethrough, LuHeading1, LuHeading2, LuHeading3,
  LuList, LuListOrdered, LuQuote, LuAlignLeft, LuAlignCenter, LuAlignRight,
  LuHighlighter, LuLink, LuUndo, LuRedo, LuTable, LuMinus, LuImage, LuCode,
} from 'react-icons/lu';
import { uploadService } from '../../services/blogService';
import toast from 'react-hot-toast';

const TiptapEditor = ({ content, onChange, placeholder = 'Start writing your amazing blog post...' }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[400px]',
      },
    },
  });

  if (!editor) return null;

  const [, setTick] = useState(0);

  useEffect(() => {
    if (!editor) return;

    let previousActiveMarks = [];

    const handleTransaction = ({ transaction }) => {
      // 1. Force React re-render so toolbar reflects active states
      setTick((t) => t + 1);

      // 2. Preserve marks on deletion
      const { state } = editor;
      if (state.selection.empty) {
        const isDelete = transaction.steps.some((step) => {
          const json = step.toJSON();
          return json.stepType === 'replace' && (!json.slice || !json.slice.content || json.slice.content.length === 0);
        });

        if (isDelete && previousActiveMarks.length > 0) {
          const activeMarkNames = ['bold', 'italic', 'underline', 'strike', 'highlight'];
          const currentActive = activeMarkNames.filter((name) => editor.isActive(name));
          const currentActiveSet = new Set(currentActive);
          const marksToRestore = previousActiveMarks.filter((name) => !currentActiveSet.has(name));

          if (marksToRestore.length > 0) {
            setTimeout(() => {
              if (editor.isDestroyed) return;
              let chain = editor.chain();
              marksToRestore.forEach((name) => {
                if (name === 'bold') chain = chain.setBold();
                else if (name === 'italic') chain = chain.setItalic();
                else if (name === 'underline') chain = chain.setUnderline();
                else if (name === 'strike') chain = chain.setStrike();
                else if (name === 'highlight') chain = chain.setHighlight();
              });
              chain.run();
            }, 0);
          }
        }
      }

      // Save the active marks of the new state for the next transaction
      const activeMarkNames = ['bold', 'italic', 'underline', 'strike', 'highlight'];
      previousActiveMarks = activeMarkNames.filter((name) => editor.isActive(name));
    };

    editor.on('transaction', handleTransaction);
    return () => {
      editor.off('transaction', handleTransaction);
    };
  }, [editor]);

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        toast.loading('Uploading image...', { id: 'img-upload' });
        const { data } = await uploadService.uploadImage(file);
        if (data.success) {
          editor.chain().focus().setImage({ src: data.url }).run();
          toast.success('Image uploaded!', { id: 'img-upload' });
        }
      } catch {
        toast.error('Image upload failed', { id: 'img-upload' });
      }
    };
    input.click();
  };

  const addLink = () => {
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const ToolButton = ({ onClick, isActive = false, children, title }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      title={title}
      className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer flex-shrink-0 ${
        isActive
          ? 'bg-primary-500 text-white shadow-sm'
          : 'hover:bg-primary-50 dark:hover:bg-surface-dark-3 text-content-light-muted dark:text-content-dark-muted'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="tiptap-editor border border-primary-200 dark:border-glass-border-dark rounded-2xl overflow-hidden bg-white dark:bg-surface-dark-2">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-3 px-4 border-b border-primary-200 dark:border-glass-border-dark bg-surface-light-2 dark:bg-surface-dark-3">
        {/* Text formatting */}
        <ToolButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
          <LuBold className="text-base" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
          <LuItalic className="text-base" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
          <LuUnderline className="text-base" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
          <LuStrikethrough className="text-base" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} title="Highlight">
          <LuHighlighter className="text-base" />
        </ToolButton>

        <div className="w-px h-6 bg-primary-200 dark:bg-glass-border-dark mx-1" />

        {/* Headings */}
        <ToolButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="H1">
          <LuHeading1 className="text-base" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="H2">
          <LuHeading2 className="text-base" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="H3">
          <LuHeading3 className="text-base" />
        </ToolButton>

        <div className="w-px h-6 bg-primary-200 dark:bg-glass-border-dark mx-1" />

        {/* Lists */}
        <ToolButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
          <LuList className="text-base" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List">
          <LuListOrdered className="text-base" />
        </ToolButton>

        <div className="w-px h-6 bg-primary-200 dark:bg-glass-border-dark mx-1" />

        {/* Block */}
        <ToolButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Quote">
          <LuQuote className="text-base" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} title="Code Block">
          <LuCode className="text-base" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
          <LuMinus className="text-base" />
        </ToolButton>

        <div className="w-px h-6 bg-primary-200 dark:bg-glass-border-dark mx-1" />

        {/* Alignment */}
        <ToolButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left">
          <LuAlignLeft className="text-base" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center">
          <LuAlignCenter className="text-base" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right">
          <LuAlignRight className="text-base" />
        </ToolButton>

        <div className="w-px h-6 bg-primary-200 dark:bg-glass-border-dark mx-1" />

        {/* Media & Links */}
        <ToolButton onClick={addLink} isActive={editor.isActive('link')} title="Link">
          <LuLink className="text-base" />
        </ToolButton>
        <ToolButton onClick={handleImageUpload} title="Image">
          <LuImage className="text-base" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Table">
          <LuTable className="text-base" />
        </ToolButton>

        <div className="w-px h-6 bg-primary-200 dark:bg-glass-border-dark mx-1" />

        {/* Undo/Redo */}
        <ToolButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <LuUndo className="text-base" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <LuRedo className="text-base" />
        </ToolButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
