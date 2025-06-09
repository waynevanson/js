import { tag, required } from "./src/index.jsx"
import { render } from "solid-js/web"

const Main = tag("main")

const List = tag("ul")

const Item = tag("li")

const Button = required(tag("button"), ["children"])

// for styled api
// add a class to classList

function App() {
  return (
    <Main>
      <List>
        <Item>
          <Button>Hit me</Button>
        </Item>
      </List>
    </Main>
  )
}

render(() => <App />, document.body)
