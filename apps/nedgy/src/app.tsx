// todo: worry less about looks and make it functional.
import { createMemo, For, Index } from "solid-js"
import { createStore, produce } from "solid-js/store"
import styles from "./app.module.css"
import { v7 as uuid } from "uuid"

export type NodeId = string
export type UserData = Record<string, string>
export type Weight<T> = { internal: T; attributes: UserData }
export type NodeWeightInternal = {}
export type NodeWeightExternal = {}

export interface AppStore {
  nodes: Record<NodeId, Weight<NodeWeightInternal>>
}

export interface AppRefs {}

export function App() {
  const [store, storeSet] = createStore<AppStore>({
    nodes: {
      [uuid()]: { attributes: { hey: "bro" }, internal: {} },
    },
  })

  const nodes = createMemo(() =>
    Object.entries(store.nodes).map(([id, weight]) => ({
      id,
      internal: weight.internal,
      attrs: Object.entries(weight.attributes).map(([name, value]) => ({
        name,
        value,
      })),
    })),
  )

  function handleAddNode() {
    storeSet("nodes", { [uuid()]: { attributes: {}, internal: {} } })
  }

  function handleRemoveNode(id: NodeId) {
    storeSet(
      "nodes",
      produce((nodes) => {
        delete nodes[id]
        return nodes
      }),
    )
  }

  return (
    <main>
      <div>
        <button onclick={handleAddNode}>Add new node</button>
      </div>
      <ul class={styles.nodes}>
        <For each={nodes()}>
          {(node) => (
            <li class={styles.node}>
              <button onclick={() => handleRemoveNode(node.id)}>X</button>
              <div>{node.id}</div>
              <ul>
                <For each={node.attrs}>
                  {(attr) => (
                    <li>
                      <div>{attr.name}</div>
                      <div>{attr.value}</div>
                    </li>
                  )}
                </For>
              </ul>
            </li>
          )}
        </For>
      </ul>
    </main>
  )
}

// directed, cyclical graph
export interface Graph {}
