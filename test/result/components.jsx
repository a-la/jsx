// returns normal JS if JSX is not found.
const Element = ({ test, children, id }) => `<div id="${id}">
  Hello, ${test}! ${children}
  <div class={'TEST'} id=${id}>test</div>
</div>`

/* expected */
const Element = ({ test, children, id }) => `<div id="${id}">
  Hello, ${test}! ${children}
  <div class={'TEST'} id=${id}>test</div>
</div>`
/**/

// processes a very simple component
const Static = <div>Hello, World</div>

/* expected */
const Static = h('div',{},`Hello, World`)
/**/

// processes a component with a variable
const Param = ({ test }) => <div>Hello, { test }!</div>

/* expected */
const Param = ({ test }) => h('div',{},`Hello, `,test,`!`)
/**/

// processes a component with property and variable
const A = ({ title, href }) => <a href={href}>{ title }</a>

/* expected */
const A = ({ title, href }) =>     h('a',{href:href},title)
/**/

// processes a simple component
const Element = ({ test, children, id }) => <div id={ 'id' }>
  Hello, { test }! { children }
  <div class={ 'TEST' }>test</div>
</div>

/* expected */
const Element = ({ test, children, id }) => h('div',{id: 'id' },`
  Hello, `,test,`! `,children,`
  `,h('div',{class: 'TEST' },`test`),`
`)
/**/

// processes a Component
const El = <div><Element test={'test'+a}>Test</Element></div>

/* expected */
const El =      h('div',{},h(Element,{test:'test'+a},`Test`))
/**/

// processes an inner Component tag
const a = 'test'
const Element = ({ test, children }) => <h1>Hello, { test }! { children }</h1>
const Element2 = () => <div><Element test={'test'+a}>Test</Element></div>

/* expected */
const a = 'test'
const Element = ({ test, children }) => h('h1',{},`Hello, `,test,`! `,children)
const Element2 = () =>      h('div',{},h(Element,{test:'test'+a},`Test`))
/**/

// uses new lines in the properties
const Element = () => <div onclick={
  'test'
}></div>

/* expected */
const Element = () =>    h('div',{onclick:
  'test'
})
/**/

// processes a tag with function in props
const Element = ({ cb }) => <div onclick={() => {
  return () => {
    cb('test')
  }
}}>Test</div>

/* expected */
const Element = ({ cb }) => h('div',{onclick:() => {
  return () => {
    cb('test')
  }
}},`Test`)
/**/

// processes a tag with function in props (2)
const Element = ({ test }) => <div onclick={() => {
  return test
}}></div>

/* expected */
const Element = ({ test }) =>    h('div',{onclick:() => {
  return test
}})
/**/