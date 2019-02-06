// quotes the properties for Dom
<div className="test">
  <div onClick={() => {}}/>
  <C randomProp="test"/>
</div>

/* expected */
h('div',{'className':"test"},`
  `,h('div',{'onClick':() => {}}),`
  `,h(C,{randomProp:"test"}),`
`)
/**/