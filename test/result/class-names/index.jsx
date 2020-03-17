/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
import { h } from 'preact'

// processes class names
var Example = () => <h1 test>Title</h1>;

/* classNames */
({ test: true })
/**/

/* expected */
var Example = () => h('h1',{className:'test'},`Title`);
/**/

// keeps line numbers
var Example = () => <h1 className="Hello"
  test data-hello
  example
  data-test
>Title</h1>;

/* classNames */
({ test: true, example: 'example-test' })
/**/

/* expected */
var Example = () => h('h1',{className:"Hello test example-test",
   'data-hello':true,

  'data-test':true
},`Title`);
/**/