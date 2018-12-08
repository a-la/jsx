## The Transform

The transform is the Reg-Exp alternative to Babel's implementation of the JSX transform. We're not aware of any other alternatives, however this approach provides a light-weight approach for transforming `JSX` syntax for back-end rendering and static website generation. The lit-html is based on template strings, and does not provide html highlighting which is enabled in .jsx files. This makes JSX the standard of modern HTML templating. The service using the JSX does not have to be a react page, so that the transform can be used to server-side rendering which will always require serving HTML using a template.

```js
// processes a simple component
const Element = ({ test, children, id }) => <div id={ 'id' }>
  Hello, { test }! { children }
  <div class={ 'TEST' }>test</div>
</div>

/* expected */
const Element = ({ test, children, id }) =>            p('div',{id:'id'},'  Hello, ',test,'! ',children,p('div',{class:'TEST'},'test'))
/**/
```

%~%
