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

// processes a component with another component
const Title = () => <h1>Title</h1>
const Static = <div>
  <Title></Title>
  Hello, World
</div>

/* expected */
const Title = () => h('h1',{},`Title`)
const Static = h('div',{},`
  `,h(Title),`
  Hello, World
`)
/**/

// processes a self-closing component
const Title = <Title id={'test'} callback={() => {
  return 'test'
}} class="TEST"/>

/* expected */
const Title =   h(Title,{id:'test',callback:() => {
  return 'test'
},class:"TEST"})
/**/

// processes tag with multiple elements of the same type
const Element = <div>
  Hello <span>World</span><span>!</span>
</div>

/* expected */
const Element = h('div',{},`
  Hello `,h('span',{},`World`),h('span',{},`!`),`
`)
/**/

// processes a component with a variable
const Param = ({ test }) => <div>Hello, { test }!</div>

/* expected */
const Param = ({ test }) => h('div',{},`Hello, `, test ,`!`)
/**/

// processes a component with property and variable
const A = ({ title, href }) => <a href={href}>{ title }</a>

/* expected */
const A = ({ title, href }) =>   h('a',{href:href}, title )
/**/

// processes a simple component
const Element = ({ test, children, id }) => <div id={ 'id' }>
  Hello, { test }! { children }
  <div class={ 'TEST' }>test</div>
</div>

/* expected */
const Element = ({ test, children, id }) => h('div',{id: 'id' },`
  Hello, `, test ,`! `, children ,`
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
const Element = ({ test, children }) => h('h1',{},`Hello, `, test ,`! `, children )
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

// processes content with arrow functions
<div>
  <img src={profilePicture} width="50"/>
  Hello, {firstName} {lastName}!
  <a href="#" onClick={(e) => {
    e.preventDefault()
    signOut(host, csrf, (err) => {
      if (err) alert(`Could not sign out: ${err}. Please refresh the page and try again. Alternatively, clear your cookies.`)
      else onSignout()
    })
    return false
  }}>Sign Out</a>
</div>

/* expected */
h('div',{},`
  `,h('img',{src:profilePicture,width:"50"}),`
  Hello, `,firstName,` `,lastName,`!
  `,h('a',{onClick:(e) => {
    e.preventDefault()
    signOut(host, csrf, (err) => {
      if (err) alert(`Could not sign out: ${err}. Please refresh the page and try again. Alternatively, clear your cookies.`)
      else onSignout()
    })
    return false
  },href:"#"},`Sign Out`),`
`)
/**/

// destructures the properties
<div {...props} id={test}/>

/* expected */
h('div',{...props,id:test})
/**/

// processes self-closing without props
<div>
  <RichTextArea/>
  <RichTextArea />
  <span>Test</span>
</div>

/* expected */
h('div',{},`
  `,h(RichTextArea),`
  `,h(RichTextArea),`
  `,h('span',{},`Test`),`
`)
/**/

// ignores imports
import test from 'test'
import './style.css'
<div/>

/* expected */
import test from 'test'
import './style.css'
h('div')
/**/

// processes simple map
export const StoriesMenu = ({ pages }) => {
  return <ul className="AjaxNav">
    {pages.map(({ title, url }, i) => `test-${title}`)}
  </ul>
}

/* expected */
export const StoriesMenu = ({ pages }) => {
  return h('ul',{className:"AjaxNav"},`
    `,pages.map(({ title, url }, i) => `test-${title}`),`
  `)
}
/**/

// processes map
export const StoriesMenu = ({ pages }) => {
  return <ul className="AjaxNav">
    {pages.map(({ title, url }, i) =>
      <a key={i} href={url}>{title}</a>
    )}
  </ul>
}

/* expected */
export const StoriesMenu = ({ pages }) => {
  return h('ul',{className:"AjaxNav"},`
    `,pages.map(({ title, url }, i) =>
      h('a',{key:i,href:url},title)
    ),`
  `)
}
/**/

// processes jsx with export from
const Component = () => <div/>
export { Test } from './test'
/* expected */
const Component = () => h('div')
export { Test } from './test'
/**/

// test
const Item = ({ img, title }) => {
  return <tr className="IndexItem my-1">
    <td>{img && <img src={img}/>}</td>
    <td><h3>{title}</h3></td>
  </tr>
}

/* expected */
const Item = ({ img, title }) => {
  return h('tr',{className:"IndexItem my-1"},`
    `,h('td',{},img && h('img',{src:img})),`
    `,h('td',{},h('h3',{},title)),`
  `)
}
/**/