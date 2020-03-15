["testing", "example"]

## updates dynamic property
class={'hello world'} id={id} testing

```json expected */
{
  "class": "'hello world testing'",
  "id": "id"
}
```

## does not update when not `true`
class={'hello world'} id={id} example testing="ok"

```json expected */
{
  "class": "'hello world example'",
  "id": "id",
  "testing": "\"ok\""
}
```

## updates dynamic property with variable
class={className} id={id} testing

```json expected */
{"class": "className+' testing'", "id": "id"}
```

## updates string property
class="hello world" id={id} testing

```json expected */
{
  "id": "id",
  "class": "\"hello world testing\""
}
```

## updates dynamic property with className
className={'hello world'} id={id} testing example

```json expected */
{
  "className": "'hello world testing example'",
  "id": "id"
}
```

## updates dynamic property with variable with className
className={className} id={id} testing example

```json expected */
{
  "className": "className+' testing example'",
  "id": "id"
}
```

## updates string property with className
className="hello world" id={id} testing example

```json expected */
{
  "id": "id",
  "className": "\"hello world testing example\""
}
```

## updates without className
id={id} testing example

```json expected */
{
  "id": "id",
  "className": "'testing example'"
}
```
