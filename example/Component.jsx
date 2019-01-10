const Title = <title>Example</title>

export const Component = ({ align = 'right' }) => {
  const props = {
    class: 'example',
    id: 'id',
  }
  return <div>
    <Title/>
    <p {...props} align={align}>
      Hello World!
    </p>
  </div>
}