["testing", "example", "test"]

## sets class and prop
id={id} Testing example test

```json expected */
{
  "className": "'Example testing test'",
  "id": "id"
}
```

```json renameMap */
{
  "example": "testing",
  "Testing": "Example"
}
```
