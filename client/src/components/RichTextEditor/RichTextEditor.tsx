import Styles from './RichTextEditor.module.css'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import { useEffect } from 'react'

interface RichTextEditorProps {
  value: string,
  onChange: (value: string) => void
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      Underline,
      Heading.configure({ levels: [3] }),
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // šalje HTML string nazad u formu
    }
  })
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);
  if (!editor) return null

  return (
    <div className={Styles.editorWrapper}>
      <div className={Styles.toolbar}>
        <button type='button' title='Zaglavlje' onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`${editor.isActive('heading', { level: 3 }) ? Styles.active : ''} ${Styles.noPadding}`}>
          <H3 className={Styles.icon} />
        </button>
        <button type='button' title='Podebljano' onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? Styles.active : ''}>
          <BoldIcon className={Styles.icon} />
        </button>
        <button type='button' title='Iskošeno' onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? Styles.active : ''}>
          <ItalicIcon className={Styles.icon} />
        </button>
        <button type='button' title='Podvučeno' onClick={() => editor.chain().focus().toggleUnderline().run()} className={`${editor.isActive('underline') ? Styles.active : ''} ${Styles.padding2px}`}>
          <UnderlineIcon className={Styles.icon} />
        </button>
        <button type='button' title='Neuređena lista' onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${editor.isActive('bulletList') ? Styles.active : ''} ${Styles.padding2px}`}>
          <UnorderedListIcon className={Styles.icon} />
        </button>
        <button type='button' title='Uređena lista' onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${editor.isActive('orderedList') ? Styles.active : ''} ${Styles.padding2px}`}>
          <OrderedListIcon className={Styles.icon} />
        </button>
        <button type='button' title='Očisti format' onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} className={Styles.padding2px}>
          <ClearFormatting className={Styles.icon} />
        </button>
      </div>
      <EditorContent editor={editor} className={Styles.editorContent} />
    </div>
  )
}

// Bold
const BoldIcon = ({className}: {className: string | undefined}) => {
  const cln = className ? className : ''
  return(<svg xmlns="http://www.w3.org/2000/svg" className={cln} version="1.1" x="0" y="0" viewBox="0 0 330 330"><g><path d="M310.874 97.5c0-53.762-43.738-97.5-97.5-97.5H49.126c-16.568 0-30 13.432-30 30s13.432 30 30 30h12.748v210H49.126c-16.568 0-30 13.432-30 30s13.432 30 30 30h164.248c53.762 0 97.5-43.738 97.5-97.5 0-26.174-10.369-49.969-27.212-67.5 16.843-17.531 27.212-41.326 27.212-67.5zm-97.5 37.5h-91.5V60h91.5c20.678 0 37.5 16.822 37.5 37.5s-16.822 37.5-37.5 37.5zm0 135h-91.5v-75h91.5c20.678 0 37.5 16.822 37.5 37.5s-16.822 37.5-37.5 37.5z" opacity="1" data-original="#000000"></path></g></svg>)
}
const UnderlineIcon = ({className} : {className: string | undefined}) => {
  const cln = className ? className : ''
  return (<svg xmlns="http://www.w3.org/2000/svg" className={cln} version="1.1" x="0" y="0" viewBox="0 0 300 300"><g><path d="M230 0c-8.284 0-15 6.716-15 15v130c0 35.841-29.16 65-65.002 65-17.362 0-33.684-6.762-45.961-19.038C91.759 178.685 84.999 162.361 85 144.999V15c0-8.284-6.716-15-15-15S55 6.716 55 15v129.998c-.001 25.375 9.879 49.232 27.823 67.177 17.943 17.943 41.8 27.825 67.175 27.825C202.382 240 245 197.383 245 145V15c0-8.284-6.716-15-15-15zM230 270H70c-8.284 0-15 6.716-15 15s6.716 15 15 15h160c8.284 0 15-6.716 15-15s-6.716-15-15-15z"opacity="1"></path></g></svg>)
}
const ItalicIcon = ({className} : {className: string | undefined}) => {
  const cln = className ? className : ''
  return (<svg xmlns="http://www.w3.org/2000/svg" className={cln} version="1.1" x="0" y="0" viewBox="0 0 330.003 330.003"><g><path d="M255.001 0h-120c-8.284 0-15 6.716-15 15s6.716 15 15 15h41.703l-54 270H75.001c-8.284 0-15 6.716-15 15s6.716 15 15 15h59.956c.02 0 .04.003.059.003.023 0 .045-.003.066-.003H195c8.284 0 15-6.716 15-15s-6.716-15-15-15h-41.703l54-270H255c8.284 0 15-6.716 15-15s-6.714-15-14.999-15z" opacity="1" data-original="#000000"></path></g></svg>)
}
const UnorderedListIcon = ({className} : {className: string | undefined}) => {
  const cln = className ? className : ''
  return (<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" viewBox="0 0 330 330"  className={cln}><g><path d="M75 60h240c8.284 0 15-6.716 15-15s-6.716-15-15-15H75c-8.284 0-15 6.716-15 15s6.716 15 15 15zM315 90H75c-8.284 0-15 6.716-15 15s6.716 15 15 15h240c8.284 0 15-6.716 15-15s-6.716-15-15-15zM315 150H75c-8.284 0-15 6.716-15 15s6.716 15 15 15h240c8.284 0 15-6.716 15-15s-6.716-15-15-15zM315 270H75c-8.284 0-15 6.716-15 15s6.716 15 15 15h240c8.284 0 15-6.716 15-15s-6.716-15-15-15zM315 210H75c-8.284 0-15 6.716-15 15s6.716 15 15 15h240c8.284 0 15-6.716 15-15s-6.716-15-15-15zM15 30c-3.95 0-7.82 1.6-10.61 4.39A15.13 15.13 0 0 0 0 45c0 3.95 1.6 7.81 4.39 10.61A15.13 15.13 0 0 0 15 60c3.95 0 7.81-1.6 10.61-4.39A15.13 15.13 0 0 0 30 45c0-3.95-1.6-7.81-4.39-10.61A15.111 15.111 0 0 0 15 30zM15 90c-3.95 0-7.82 1.6-10.61 4.39A15.13 15.13 0 0 0 0 105c0 3.95 1.6 7.81 4.39 10.61A15.13 15.13 0 0 0 15 120c3.95 0 7.81-1.6 10.61-4.39C28.4 112.82 30 108.95 30 105c0-3.95-1.6-7.81-4.39-10.61A15.111 15.111 0 0 0 15 90zM15 150c-3.95 0-7.82 1.6-10.61 4.39A15.13 15.13 0 0 0 0 165c0 3.95 1.6 7.81 4.39 10.61C7.18 178.4 11.05 180 15 180c3.95 0 7.82-1.6 10.61-4.39C28.4 172.82 30 168.95 30 165c0-3.95-1.6-7.81-4.39-10.61A15.111 15.111 0 0 0 15 150zM15 270c-3.95 0-7.82 1.6-10.61 4.39A15.13 15.13 0 0 0 0 285c0 3.95 1.6 7.81 4.39 10.61C7.18 298.4 11.05 300 15 300c3.95 0 7.81-1.6 10.61-4.39A15.13 15.13 0 0 0 30 285c0-3.95-1.6-7.82-4.39-10.61A15.111 15.111 0 0 0 15 270zM15 210c-3.95 0-7.82 1.6-10.61 4.39A15.13 15.13 0 0 0 0 225c0 3.95 1.6 7.81 4.39 10.61C7.18 238.4 11.05 240 15 240c3.95 0 7.82-1.6 10.61-4.39A15.13 15.13 0 0 0 30 225c0-3.95-1.6-7.82-4.39-10.61A15.111 15.111 0 0 0 15 210z" opacity="1"></path></g></svg>)
}
const OrderedListIcon = ({className} : {className: string | undefined}) => {
  const cln = className ? className : ''
  return (<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" viewBox="0 0 317.109 317.109" className={cln}><g><path d="M102.109 53.555h200c8.284 0 15-6.716 15-15s-6.716-15-15-15h-200c-8.284 0-15 6.716-15 15s6.716 15 15 15zM302.109 83.555h-200c-8.284 0-15 6.716-15 15s6.716 15 15 15h200c8.284 0 15-6.716 15-15s-6.715-15-15-15zM302.109 143.555h-200c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15h200c8.284 0 15-6.716 15-15 0-8.285-6.715-15-15-15zM302.109 263.555h-200c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15h200c8.284 0 15-6.716 15-15 0-8.284-6.715-15-15-15zM302.109 203.555h-200c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15h200c8.284 0 15-6.716 15-15 0-8.285-6.715-15-15-15zM17.826 49.036V86.6c0 4.074 3.32 7.146 7.724 7.146 4.33 0 7.721-3.139 7.721-7.146V30.425c0-3.96-3.247-7.062-7.392-7.062-3.647 0-5.471 2.447-6.07 3.251a6.54 6.54 0 0 0-.074.102l-6.526 9.233c-1.267 1.378-2.394 3.582-2.394 5.696-.001 4.03 3.133 7.317 7.011 7.391zM7.63 193.746h29.406c3.849 0 6.981-3.391 6.981-7.559 0-4.124-3.131-7.479-6.981-7.479H15.684v-.122c0-2.246 5.148-5.878 9.285-8.797 8.229-5.807 18.47-13.033 18.47-25.565 0-11.893-9.216-20.86-21.438-20.86-11.703 0-20.527 8.044-20.527 18.711 0 6.19 4.029 8.387 7.479 8.387 4.938 0 7.889-3.676 7.889-7.23 0-2.21.568-4.746 4.994-4.746 5.979 0 6.151 5.298 6.151 5.902 0 4.762-6.18 9.213-12.157 13.519C8.442 163.228.068 169.26.068 178.587v8.011c-.001 4.276 3.91 7.148 7.562 7.148zM42.446 242.783c0-12.342-7.288-19.42-19.994-19.42-16.66 0-21.062 11.898-21.062 18.189 0 7.325 5.445 8.115 7.786 8.115 4.559 0 7.621-3.063 7.621-7.622 0-1.753.624-3.766 5.487-3.766 3.495 0 4.918.503 4.918 5.568 0 4.948-1.062 5.487-5.245 5.487-4.018 0-7.047 3.17-7.047 7.375 0 4.159 3.066 7.295 7.131 7.295 5.525 0 6.635 2.256 6.635 5.897v1.558c0 6.126-2.389 7.288-6.798 7.288-6.083 0-6.556-3.133-6.556-4.093 0-3.631-2.407-7.294-7.785-7.294-4.72 0-7.538 2.942-7.538 7.869 0 8.976 7.696 18.516 21.958 18.516 13.854 0 22.126-8.331 22.126-22.286v-1.558c0-5.722-1.83-10.465-5.264-13.876 2.352-3.403 3.627-7.944 3.627-13.242z" opacity="1" data-original="#000000"></path></g></svg>)
}
const ClearFormatting = ({className} : {className: string | undefined}) => {
  const cln = className ? className : ''
  return (<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" viewBox="0 0 330 330" className={cln}><g><path d="M315 285H201.214l124.393-124.394c5.858-5.857 5.858-15.355 0-21.213l-120-120c-5.857-5.858-15.355-5.858-21.213 0l-180 179.999a14.996 14.996 0 0 0 0 21.214l90 90A14.999 14.999 0 0 0 105 314.999l60 .001.017-.001L315 315c8.283 0 15-6.716 15-15 0-8.284-6.716-15-15-15zM195 51.213 293.787 150 207 236.787 108.213 138 195 51.213z" opacity="1" data-original="#000000"></path></g></svg>)
}
const H3 = ({className} : {className: string | undefined}) => {
  const cln = className ? className : ''
  return (<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" viewBox="0 0 24 24" className={cln}><g><path d="M9.25 12.75h-6.5V18a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 1.5 0v5.25h6.5V6a.75.75 0 0 1 1.5 0v12a.75.75 0 0 1-1.5 0zm13.495 2.45a3.725 3.725 0 0 0-1.025-2.782A3.71 3.71 0 0 0 21.23 12a3.71 3.71 0 0 0 .489-.418A3.725 3.725 0 0 0 22.745 8.8c-.105-1.99-1.824-3.55-3.915-3.55H17A3.754 3.754 0 0 0 13.25 9a.75.75 0 0 0 1.5 0c0-1.24 1.01-2.25 2.25-2.25h1.83c1.271 0 2.355.955 2.417 2.128.032.625-.186 1.219-.615 1.67s-1.01.702-1.632.702h-1a.75.75 0 0 0 0 1.5h1c.623 0 1.202.249 1.632.701s.647 1.046.615 1.671c-.062 1.173-1.146 2.128-2.417 2.128H17c-1.24 0-2.25-1.01-2.25-2.25a.75.75 0 0 0-1.5 0A3.754 3.754 0 0 0 17 18.75h1.83c2.09 0 3.81-1.56 3.915-3.55z"></path></g></svg>)
}
