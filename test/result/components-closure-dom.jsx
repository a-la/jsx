import { h } from 'preact'
const C = () => {}

// quotes the properties for Dom
(<div className="test">
  <div onClick={() => {}}/>
  <C randomProp="test"/>
</div>)

/* expected */
h('div',{'className':"test"},
  h('div',{'onClick':() => {}}),
  h(C,{randomProp:"test"}),
);
/**/

// keeps the whitespace for args
(<div className="test"
  testThis
  newArg="test"
  required="required"
/>)

/* expected */
h('div',{'className':"test",
  'testThis':'',
  'newArg':"test",
  'required':"required"
});
/**/