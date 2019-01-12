import RichTextArea from 'richtext'

const Title = <title>Example</title>

export const Component = ({ align = 'right' }) => {
  const props = {
    class: 'example',
    id: 'id',
  }
  return <div onClick={(e) => {
    e.preventDefault()
    alert('Hello World')
    return false
  }} role="aria-button">
    <Title/>
    <RichTextArea />
    <p {...props} align={align}>
      Hello World!
    </p>
  </div>
}