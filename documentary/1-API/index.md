## API

The package is available by importing its default function:

```js
import jsx from '@a-la/jsx'
```

%~%

```## jsx => string
[
  ["string", "string"],
  ["config", "Config"]
]
```

Returns the transpiled JSX code into `h` pragma calls.

%TYPEDEF types/index.xml%

%EXAMPLE: example/example.js, ../src => @a-la/jsx%

*Given the component's source code:*
%EXAMPLE: example/Component.jsx, ../src => @a-la/jsx, jsx%

*The following result is achieved:*
%FORK-js example example/example%

%~%