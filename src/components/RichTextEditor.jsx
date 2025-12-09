import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, ListOrdered, Heading1, Heading2, Undo, Redo, Link as LinkIcon } from 'lucide-react'
import { Button } from './ui/Button'
import { useState, useEffect, useRef } from 'react'

export default function RichTextEditor({ content, onChange }) {
  const [showHeadingMenu, setShowHeadingMenu] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkTarget, setLinkTarget] = useState('_self')
  const headingMenuRef = useRef(null)
  const linkDialogRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (headingMenuRef.current && !headingMenuRef.current.contains(event.target)) {
        setShowHeadingMenu(false)
      }
      if (linkDialogRef.current && !linkDialogRef.current.contains(event.target)) {
        setShowLinkDialog(false)
      }
    }

    if (showHeadingMenu || showLinkDialog) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showHeadingMenu, showLinkDialog])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6]
        }
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_self',
        },
      })
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

  // Handle link button click
  const handleLinkClick = () => {
    const previousUrl = editor.getAttributes('link').href
    const previousTarget = editor.getAttributes('link').target || '_self'

    if (previousUrl) {
      setLinkUrl(previousUrl)
      setLinkTarget(previousTarget)
    } else {
      setLinkUrl('')
      setLinkTarget('_self')
    }

    setShowLinkDialog(true)
  }

  // Handle link save
  const handleLinkSave = () => {
    if (linkUrl === '') {
      editor.chain().focus().unsetLink().run()
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl, target: linkTarget })
        .run()
    }

    setShowLinkDialog(false)
    setLinkUrl('')
    setLinkTarget('_self')
  }

  // Handle link remove
  const handleLinkRemove = () => {
    editor.chain().focus().unsetLink().run()
    setShowLinkDialog(false)
    setLinkUrl('')
    setLinkTarget('_self')
  }

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

        {/* Link */}
        <div className="relative">
          <Button
            type="button"
            variant={editor.isActive('link') ? 'default' : 'ghost'}
            size="sm"
            onClick={handleLinkClick}
            title="Add Link"
          >
            <LinkIcon className="w-4 h-4" />
          </Button>

          {showLinkDialog && (
            <div
              ref={linkDialogRef}
              className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 p-3 min-w-[300px]"
            >
              <div className="mb-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleLinkSave()
                    }
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Open in
                </label>
                <select
                  value={linkTarget}
                  onChange={(e) => setLinkTarget(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                >
                  <option value="_self">Same tab</option>
                  <option value="_blank">New tab</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={handleLinkSave}
                  className="flex-1"
                >
                  Save
                </Button>
                {editor.isActive('link') && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleLinkRemove}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

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
