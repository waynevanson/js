import { tag, partials } from "../src/index"

const a = tag("a")
const ahref = partials(a, { href: "" })
