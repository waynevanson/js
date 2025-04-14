// todo: worry less about looks and make it functional.
import { createMemo, createSelector, For } from "solid-js"
import { createStore, produce } from "solid-js/store"
import { v7 as uuid } from "uuid"
import styles from "./app.module.css"

export type NodeId = string
export type NodeWeightExternal = Record<string, string>
export type NodeWeightInternal = {}
export type Weights = {
  internal: NodeWeightInternal
  attributes: NodeWeightExternal
}

export interface AppStore {
  nodes: Record<NodeId, Weights>
  edges: Record<NodeId, Record<NodeId, Record<string, {}>>>
  selecting: NodeId | undefined
}

export interface AppRefs {}

export function createAppStore() {
  const [store, storeSet] = createStore<AppStore>({
    selecting: undefined,
    nodes: {
      [uuid()]: { attributes: { hey: "bro" }, internal: {} },
    },
    edges: {},
  })

  const isNodeSelected = createSelector(() => store.selecting)

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

  const edges = createMemo(() =>
    Object.entries(store.edges).flatMap(([source, targets]) =>
      Object.entries(targets).flatMap(([target, weights]) =>
        Object.entries(weights).map(([weight, value]) => ({
          source,
          target,
          weight,
          value,
        })),
      ),
    ),
  )

  function handleAddNode() {
    storeSet("nodes", {
      [uuid()]: { attributes: {}, internal: { selected: false } },
    })
  }

  function handleSelected(id: NodeId) {
    if (store.selecting === undefined) {
      storeSet("selecting", id)
      return
    }

    if (store.selecting !== id) {
      storeSet(
        "edges",
        produce((sources) => {
          if (!sources.hasOwnProperty(store.selecting!)) {
            sources[store.selecting!] = {}
          }

          if (!sources[store.selecting!][id]) {
            sources[store.selecting!][id] = {}
          }

          sources[store.selecting!][id][uuid()] = {}
        }),
      )
    }

    storeSet("selecting", undefined)
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

  function handleDeleteEdge(
    ids: Record<"source" | "target" | "weight", string>,
  ) {
    storeSet(
      "edges",
      ids.source,
      ids.target,
      produce((weights) => {
        delete weights[ids.weight]
      }),
    )
  }

  return {
    store,
    storeSet,
    nodes,
    edges,
    handleAddNode,
    handleSelected,
    handleRemoveNode,
    isNodeSelected,
    handleDeleteEdge,
  }
}

export function App() {
  const {
    edges,
    handleAddNode,
    handleRemoveNode,
    handleSelected,
    isNodeSelected,
    nodes,
    handleDeleteEdge,
  } = createAppStore()

  return (
    <main>
      <div>
        <button onclick={handleAddNode}>Add new node</button>
      </div>
      <ul class={styles.nodes}>
        <For each={nodes()}>
          {(node) => (
            <li class={styles.node}>
              <div>
                <button onclick={() => handleRemoveNode(node.id)}>X</button>
                <button
                  aria-selected={isNodeSelected(node.id)}
                  onclick={() => handleSelected(node.id)}
                >
                  O
                </button>
              </div>
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
      <ul>
        <For each={edges()}>
          {(edge) => (
            <li>
              <div>
                <button onclick={() => handleDeleteEdge(edge)}>X</button>
              </div>
              <div>
                <div>Source: {edge.source}</div>
                <div>Target: {edge.target}</div>
              </div>
            </li>
          )}
        </For>
      </ul>
    </main>
  )
}

// directed, cyclical graph
export interface Graph {}
