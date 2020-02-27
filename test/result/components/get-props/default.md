## gets multiple properties
class={'hello world'} id={id}

```json expected */
{"class": "'hello world'", "id": "id"}
```

## gets a single property
class={'hello world'}

```json expected */
{"class": "'hello world'"}
```

## gets props with }
callback={() => {}}

```json expected */
{"callback": "() => {}"}
```

## gets plain props
id='test' class="Test"

```json expected */
{
  "id": "'test'",
  "class": "\"Test\""
}
```

## gets plain props after {}
id={test} class="Test"

```json expected */
{
  "id": "test",
  "class": "\"Test\""
}
```

## gets multiple props with }
id="test" callback={() => {}} callback2={() => {
  return () => {
    return 'test'
  }
}}

```json expected */
{
  "id": "\"test\"",
  "callback": "() => {}",
  "callback2": "() => {\n  return () => {\n    return 'test'\n  }\n}"
}
```

## returns the whitespace
the test={ok}

```json expected */
{
  "the": "true",
  "test": "ok"
}
```
```json expectedWhitespace */
{
  "the": {
    "before": ""
  },
  "test": {
    "before": " ",
    "beforeAssign": "",
    "afterAssign": ""
  }
}
```