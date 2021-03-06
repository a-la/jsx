import RichTextArea from 'richtext'

const Title = <title>Example</title>

export const Component = ({
  align = 'right', tabs, img,
}) => {
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
    <RichTextArea dynamic />
    {tabs.map((tab, i) => <span key={i}>{tab}</span>)}
    <p {...props} align={align}>
      Hello World!
      {img && <img src={img}/>}
    </p>
  </div>
}