## updates dynamic property
class={'hello world'} id={id} Testing

```json expected */
{
  "class": "'hello world Testing'",
  "id": "id"
}
```

## updates dynamic property with variable
class={className} id={id} Testing

```json expected */
{"class": "className+' Testing'", "id": "id"}
```

## updates string property
class="hello world" id={id} Testing

```json expected */
{
  "id": "id",
  "class": "\"hello world Testing\""
}
```

## updates dynamic property with className
className={'hello world'} id={id} Testing Example

```json expected */
{
  "className": "'hello world Testing Example'",
  "id": "id"
}
```

## updates dynamic property with variable with className
className={className} id={id} Testing Example

```json expected */
{
  "className": "className+' Testing Example'",
  "id": "id"
}
```

## updates string property with className
className="hello world" id={id} Testing Example

```json expected */
{
  "id": "id",
  "className": "\"hello world Testing Example\""
}
```

## !updates without className
id={id} Testing Example

```json expected */
{
  "id": "id",
  "className": "'Testing Example'"
}
```
