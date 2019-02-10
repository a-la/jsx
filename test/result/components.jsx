// returns normal JS if JSX is not found.
var Element = ({ test, children, id }) => `<div id="${id}">
  Hello, ${test}! ${children}
  <div class={'TEST'} id=${id}>test</div>
</div>`

/* expected */
var Element = ({ test, children, id }) => `<div id="${id}">
  Hello, ${test}! ${children}
  <div class={'TEST'} id=${id}>test</div>
</div>`
/**/

// processes a very simple component
var Static = <div>Hello, World</div>

/* expected */
var Static = h('div',{},`Hello, World`)
/**/

// processes a component with another component
var Title = () => <h1>Title</h1>
var Static = <div>
  <Title></Title>
  Hello, World
</div>

/* expected */
var Title = () => h('h1',{},`Title`)
var Static =    h('div',{},
  h(Title),
  `Hello, World`
)
/**/

// processes a self-closing component
var Title = <Title id={'test'} callback={() => {
  return 'test'
}} class="TEST"/>

/* expected */
var Title =   h(Title,{id:'test',callback:() => {
  return 'test'
},class:"TEST"})
/**/

// processes tag with multiple elements of the same type
var Element = <div>
  Hello <span>World</span><span>!</span>
</div>

/* expected */
var Element = h('div',{},
  `Hello `,h('span',{},`World`),h('span',{},`!`),
)
/**/

// processes a component with a variable
var Param = ({ test }) => <div>Hello, { test }!</div>

/* expected */
var Param = ({ test }) => h('div',{},`Hello, `, test ,`!`)
/**/

// processes a component with property and variable
var A = ({ title, href }) => <a href={href}>{ title }</a>

/* expected */
var A = ({ title, href }) =>   h('a',{href:href}, title )
/**/

// processes a simple component
var Element = ({ test, children, id }) => <div id={ 'id' }>
  Hello, { test }! { children }
  <div class={ 'TEST' }>test</div>
</div>

/* expected */
var Element = ({ test, children, id }) => h('div',{id: 'id' },
  `Hello, `, test ,`! `, children ,
  h('div',{class: 'TEST' },`test`),
)
/**/

// processes a Component
var El = <div><Element test={'test'+a}>Test</Element></div>

/* expected */
var El =      h('div',{},h(Element,{test:'test'+a},`Test`))
/**/

// processes an inner Component tag
var a = 'test'
var Element = ({ test, children }) => <h1>Hello, { test }! { children }</h1>
var Element2 = () => <div><Element test={'test'+a}>Test</Element></div>

/* expected */
var a = 'test'
var Element = ({ test, children }) => h('h1',{},`Hello, `, test ,`! `, children )
var Element2 = () =>      h('div',{},h(Element,{test:'test'+a},`Test`))
/**/

// uses new lines in the properties
var Element = () => <div onclick={
  'test'
}></div>

/* expected */
var Element = () =>    h('div',{onclick:
  'test'
})
/**/

// processes a tag with function in props
var Element = ({ cb }) => <div onclick={() => {
  return () => {
    cb('test')
  }
}}>Test</div>

/* expected */
var Element = ({ cb }) => h('div',{onclick:() => {
  return () => {
    cb('test')
  }
}},`Test`)
/**/

// processes a tag with function in props (2)
var Element = ({ test }) => <div onclick={() => {
  return test
}}></div>

/* expected */
var Element = ({ test }) =>    h('div',{onclick:() => {
  return test
}})
/**/

// processes content with arrow functions
var C = <div>
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
var C = h('div',{},
  h('img',{src:profilePicture,width:"50"}),
  `Hello, `,firstName,` `,lastName,`!`
  ,h('a',{onClick:(e) => {
    e.preventDefault()
    signOut(host, csrf, (err) => {
      if (err) alert(`Could not sign out: ${err}. Please refresh the page and try again. Alternatively, clear your cookies.`)
      else onSignout()
    })
    return false
  },href:"#"},`Sign Out`),
)
/**/

// destructures the properties
var C = <div {...props} id={test}/>

/* expected */
var C = h('div',{...props,id:test})
/**/

// processes self-closing without props
var C = <div>
  <RichTextArea/>
  <RichTextArea />
  <span>Test</span>
</div>

/* expected */
var C = h('div',{},
  h(RichTextArea),
  h(RichTextArea),
  h('span',{},`Test`),
)
/**/

// ignores imports
import test from 'test'
import './style.css'
var C = <div/>

/* expected */
import test from 'test'
import './style.css'
var C = h('div')
/**/

// processes simple map
export var StoriesMenu = ({ pages }) => {
  return <ul className="AjaxNav">
    {pages.map(({ title, url }, i) => `test-${title}`)}
  </ul>
}

/* expected */
export var StoriesMenu = ({ pages }) => {
  return h('ul',{className:"AjaxNav"},
    pages.map(({ title, url }, i) => `test-${title}`),
  )
}
/**/

// processes map
export var StoriesMenu = ({ pages }) => {
  return <ul className="AjaxNav">
    {pages.map(({ title, url }, i) =>
      <a key={i} href={url}>{title}</a>
    )}
  </ul>
}

/* expected */
export var StoriesMenu = ({ pages }) => {
  return     h('ul',{className:"AjaxNav"},
    pages.map(({ title, url }, i) =>
      h('a',{key:i,href:url},title)
    ),
  )
}
/**/

// processes jsx with export from
var Component = () => <div/>
export { Test } from './test'
/* expected */
var Component = () => h('div')
export { Test } from './test'
/**/

// processes tags that start with {
var Item = ({ img, title }) => {
  return <tr className="IndexItem my-1">
    <td>{img && <img src={img}/>}</td>
    <td><h3>{title}</h3></td>
  </tr>
}

/* expected */
var Item = ({ img, title }) => {
  return h('tr',{className:"IndexItem my-1"},
    h('td',{},img && h('img',{src:img})),
    h('td',{},h('h3',{},title)),
  )
}
/**/

// works with inner self-closing tags
<ListItem active={1} left={
  <Icon
    name="bookmark-o"
    size="xsmall"
  />
}>HelloWorld</ListItem>

/* expected */
         h(ListItem,{active:1,left:
           h(Icon,{name:"bookmark-o",size:"xsmall"})
},`HelloWorld`)
/**/

// works with multiple inner self-closing tags
var C = <div active={1}>
  <div className="test">
    HelloWorld
    <div id="App"/>
  </div>
</div>

/* expected */
var C = h('div',{active:1},
  h('div',{className:"test"},
    `HelloWorld`
    ,h('div',{id:"App"}),
  ),
)
/**/

// quotes props with dash
var C = <div data-active={1}/>

/* expected */
var C = h('div',{'data-active':1})
/**/

// writes boolean attribute
var C = <div id="test" required className="test"/>

/* expected */
var C = h('div',{id:"test",required:1,className:"test"})
/**/

// does not add new lines
var C = <div>
  <a href="#">
    {123} Hello World
  </a>
</div>

/* expected */
var C = h('div',{},
  h('a',{href:"#"},
    123,` Hello World`
  ),
)
/**/