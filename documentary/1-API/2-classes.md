## Classes

It's possible to make the transpiler extract property names and add them into the `className` property. If such property already exists, it will be updated. If it doesn't, it will be created. Moreover, when `prop2class` property is set, any property that starts with a capital letter will also be added to the class list. Finally, if you pass a rename map, the classes will be updated according to it.

_The component to transpile:_

%EXAMPLE: example/classes.jsx%

_The setup:_

%EXAMPLE: example/classes%

_The output:_

<fork lang="js">example/classes</fork>

%~%