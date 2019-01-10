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
const Static = e('div','Hello, World')
/**/

// processes a component with a variable
const Param = ({ test }) => <div>Hello, { test }!</div>

/* expected */
const Param = ({ test }) => e('div','Hello, ',test,'!')
/**/

// processes a component with property and variable
const A = ({ title, href }) => <a href={href}>{ title }</a>

/* expected */
const A = ({ title, href }) =>     p('a',{href:href},title)
/**/

// processes a simple component
const Element = ({ test, children, id }) => <div id={ 'id' }>
  Hello, { test }! { children }
  <div class={ 'TEST' }>test</div>
</div>

/* expected */
const Element = ({ test, children, id }) =>            p('div',{id:'id'},'  Hello, ',test,'! ',children,p('div',{class:'TEST'},'test'))
/**/

// processes a Component
const El = <div><Element test={'test'+a}>Test</Element></div>

/* expected */
const El =         e('div',p(Element,{test:'test'+a},'Test'))
/**/

// processes an inner Component tag
const a = 'test'
const Element = ({ test, children }) => <h1>Hello, { test }! { children }</h1>
const Element2 = () => <div><Element test={'test'+a}>Test</Element></div>

/* expected */
const a = 'test'
const Element = ({ test, children }) =>   e('h1','Hello, ',test,'! ',children)
const Element2 = () =>         e('div',p(Element,{test:'test'+a},'Test'))
/**/