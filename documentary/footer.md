## Limitations

- [ ] Cannot use `<>` in functions, and `{}` in comments e.g.,
    ```js
    const C = ({ items }) => <div>
      {items.map((i, j) => {
        // stop when { 10 }:
        if (j > 10) return
        return <span>{i}</span>
      })}
    </div>
    ```
- [ ] Cannot define components in `export default { }`, or use anything with `}`, e.g.,
    ```js
    export default {
      'my-component'() {
        return <div>Hello World</div>
      },
      nested: { val: true },
    }
    </div>
    ```

%~%

## Copyright

<alamode-footer />

%~ -1%