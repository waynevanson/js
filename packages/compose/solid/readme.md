## Notes

### Resolving "Next Outer Prop" attributes via `as`

This is pretty tricky, so here's a full diagram of what is expected to happen.

1. Probably ignore the first
2. If the previous element and next element attrs are the same, use the previous outer attr.
3. If the next element and previous outer attrs are the same, use it.
