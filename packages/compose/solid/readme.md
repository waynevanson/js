## Notes

### Resolving "Next Outer Prop" attributes via `as`

This is pretty tricky, so here's a full diagram of what is expected to happen.

1. Probably ignore the first
2. If the previous element and next element attrs are the same, use the previous outer attr.
3. If the next element and previous outer attrs are the same, use the previous.

| Next Element | Previous Outer | Next Outer | Notes             |
| ------------ | -------------- | ---------- | ----------------- |
| required     | none           | error      | Impossible right? |
| none         | required       | required   |                   |
| optional     | none           | none       |                   |
| none         | optional       | optional   |                   |
| required     | optional       | optional   |                   |
| optional     | required       | required   |                   |
| required     | required       | required   |                   |
| none         | none           | none       |                   |
| optional     | optional       | optional   |                   |
| none         | none           | required   |                   |
| required     | required       | required   |                   |
| optional     | optional       | optional   |                   |
| optional     | required       | required   |                   |
| optional     | none           | none       |                   |
| required     | none           | none       |                   |
| required     | optional       | optional   |                   |
| none         | required       | required   |                   |
| none         | optional       | optional   |                   |
| optional     | optional       | optional   |                   |
| required     | required       | required   |                   |
| none         | none           | none       |                   |
