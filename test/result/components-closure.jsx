import { h } from 'preact'

// quotes the properties
(<div className="test">
  <div onClick={() => {}}/>
</div>)

/* expected */
h('div',{'className':"test"},
  h('div',{'onClick':() => {}}),
)
/**/

// can use comments
;(<div className="test">
  {/* hello world */} abc
  {/* <div onClick={() => {}}/> */}
  <div onClick={() => {}}/>
</div>)

/* expected */
h('div',{'className':"test"},
  /* hello world */` abc`
  ,/* <div onClick={() => {}}/> */
  h('div',{'onClick':() => {}}),
)
/**/

// empty props
;(<div className="" test="foo">
  <hello world />
</div>)

/* expected */
h('div',{'className':"", 'test':"foo"},
  h('hello',{'world':true}),
)
/**/