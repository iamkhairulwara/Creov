'use client'
import dynamic from 'next/dynamic'

const GrapesEditor = dynamic(
  () => import('@/components/editor/GRAPESEDITOR'),
  { ssr: false }
)

const testHtml = `
<section style="padding: 60px; text-align: center;">
  <h1>Hello World</h1>
  <p>Edit this using drag and drop</p>
  <button>Click Me</button>
</section>
`

export default function EditorPage() {
  function handleSave(data) {
    console.log(data)
    alert('Saved! Check console.')
  }

  return (
    <GrapesEditor
      initialHtml={testHtml}
      onSave={handleSave}
    />
  )
}