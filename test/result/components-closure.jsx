// quotes the properties
<div className="test">
  <div onClick={() => {}}/>
</div>

/* expected */
h('div',{'className':"test"},`
  `,h('div',{'onClick':() => {}}),`
`)
/**/