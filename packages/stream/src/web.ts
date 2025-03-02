export class StringReplaceTranformStream extends TransformStream<string, string> {
    constructor(private search: string, private replace: string) {
        if (search.length < 1) {
            throw new Error("")
        }

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

                controller.enqueue(chunk)
            },
        })
    }
}
