const Title = <title>Example</title>

export const Component = ({ align = 'right' }) => <div>
  <Title/>
  <p align={align}>
    Hello World!
  </p>
</div>