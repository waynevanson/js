export class StringReplaceTranformStream extends TransformStream<
  string,
  string
> {
  constructor(search: string, replace: string) {
    if (search.length <= 0) {
      throw new Error(`Expected the search to be non empty`)
    }

    // todo: fix this
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let buffer = ""

    // todo: what happens if start character is in the middle of the search?
    // maybe use regex?
    // need to
    super({
      transform(chunk, controller) {
        const index = chunk.lastIndexOf(search[0])

        if (index >= 0) {
          const last = chunk.slice(index)

          if (search > last) {
            buffer = last
            chunk = chunk.slice(0, index)
          }
        }

        const replaced = chunk.replaceAll(search, replace)
        controller.enqueue(replaced)
      },
    })
  }
}
