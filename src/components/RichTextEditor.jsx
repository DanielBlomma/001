import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, ListOrdered, Heading1, Heading2, Undo, Redo } from 'lucide-react'
import { Button } from './ui/Button'
import { useState, useEffect, useRef } from 'react'

export default function RichTextEditor({ content, onChange }) {
  const [showHeadingMenu, setShowHeadingMenu] = useState(false)
  const headingMenuRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (headingMenuRef.current && !headingMenuRef.current.contains(event.target)) {
        setShowHeadingMenu(false)
      }
    }

    if (showHeadingMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showHeadingMenu])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6]
        }
      }),
      Underline
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4'
      }
    }
  })

  if (!editor) {
    return null
  }

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        {/* Bold */}
        <Button
          type="button"
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </Button>

        {/* Italic */}
        <Button
          type="button"
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </Button>

        {/* Underline */}
        <Button
          type="button"
          variant={editor.isActive('underline') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="w-4 h-4" />
        </Button>

        {/* Strikethrough */}
        <Button
          type="button"
          variant={editor.isActive('strike') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Heading Dropdown */}
        <div className="relative" ref={headingMenuRef}>
          <Button
            type="button"
            variant={editor.isActive('heading') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setShowHeadingMenu(!showHeadingMenu)}
            title="Heading Levels"
            className="min-w-[80px] justify-start"
          >
            {editor.isActive('heading', { level: 1 }) && 'H1'}
            {editor.isActive('heading', { level: 2 }) && 'H2'}
            {editor.isActive('heading', { level: 3 }) && 'H3'}
            {editor.isActive('heading', { level: 4 }) && 'H4'}
            {editor.isActive('heading', { level: 5 }) && 'H5'}
            {editor.isActive('heading', { level: 6 }) && 'H6'}
            {!editor.isActive('heading') && 'Heading'}
            <span className="ml-1">▼</span>
          </Button>

          {showHeadingMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 min-w-[120px]">
              <button
                type="button"
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-xs"
                onClick={() => {
                  editor.chain().focus().setParagraph().run()
                  setShowHeadingMenu(false)
                }}
              >
                Normal
              </button>
              {[1, 2, 3, 4, 5, 6].map(level => (
                <button
                  key={level}
                  type="button"
                  className={`block w-full text-left px-3 py-2 hover:bg-gray-100 ${
                    editor.isActive('heading', { level }) ? 'bg-blue-50 font-bold' : ''
                  }`}
                  style={{ fontSize: `${20 - level * 2}px` }}
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level }).run()
                    setShowHeadingMenu(false)
                  }}
                >
                  Heading {level}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Bullet List */}
        <Button
          type="button"
          variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </Button>

        {/* Ordered List */}
        <Button
          type="button"
          variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Undo */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </Button>

        {/* Redo */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="bg-white" />
    </div>
  )
}
