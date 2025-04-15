// todo: worry less about looks and make it functional.
import { ComponentProps, createMemo, createSelector, For } from "solid-js"
import { createStore, produce } from "solid-js/store"
import { v7 as uuid } from "uuid"
import styles from "./app.module.css"

export type NodeId = string
export type Attributes = Record<string, string>
export type NodeWeightInternal = {}

export interface AppStore {
  nodes: Record<NodeId, Attributes>
  edges: Record<NodeId, Record<NodeId, Record<string, Attributes>>>
  selecting: NodeId | undefined
}

export function createAppStore() {
  const [store, storeSet] = createStore<AppStore>({
    selecting: undefined,
    nodes: {},
    edges: {},
  })

  const isNodeSelected = createSelector(() => store.selecting)

  const nodes = createMemo(() =>
    Object.entries(store.nodes).map(([id, attributes]) => ({
      id,
      attrs: Object.entries(attributes).map(([name, value]) => ({
        name,
        value,
      })),
    })),
  )

  const edges = createMemo(() =>
    Object.entries(store.edges).flatMap(([source, targets]) =>
      Object.entries(targets).flatMap(([target, weights]) =>
        Object.entries(weights).map(([weight, attributes]) => ({
          source,
          target,
          weight,
          attributes: Object.entries(attributes).map(([name, value]) => ({
            name,
            value,
          })),
        })),
      ),
    ),
  )

  function handleAddNode() {
    storeSet("nodes", {
      [uuid()]: {},
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

  function handleUpdateNodeAttributeName(
    id: NodeId,
    prev: string,
    next: string,
  ) {
    storeSet(
      "nodes",
      id,
      produce((attributes) => {
        const value = attributes[prev]
        delete attributes[prev]
        attributes[next] = value
      }),
    )
  }

  function handleUpdateNodeAttributeValue(
    id: NodeId,
    name: string,
    value: string,
  ) {
    storeSet("nodes", id, name, value)
  }

  function handleInsertNodeAttribute(id: NodeId, name: string) {
    storeSet("nodes", id, { [name]: "" })
  }

  function handleUpdateEdgeAttributeName(
    edge: Record<"source" | "target" | "weight", string>,
    name: string,
  ) {
    storeSet(
      "edges",
      edge.source,
      edge.target,
      edge.weight,
      produce((attributes) => {
        const value = attributes[name]
        delete attributes[name]
        attributes[name] = value
      }),
    )
  }

  function handleUpdateEdgeAttributeValue(
    edge: Record<"source" | "target" | "weight", string>,
    name: string,
    value: string,
  ) {
    storeSet("edges", edge.source, edge.target, edge.weight, { [name]: value })
  }

  function handleInsertEdgeAttribute(
    edge: Record<"source" | "target" | "weight", string>,
    name: string,
  ) {
    storeSet("edges", edge.source, edge.target, edge.weight, {
      [name]: "",
    })
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
    handleUpdateNodeAttributeName,
    handleUpdateNodeAttributeValue,
    handleInsertNodeAttribute,
    handleUpdateEdgeAttributeName,
    handleUpdateEdgeAttributeValue,
    handleInsertEdgeAttribute,
  }
}

export function App() {
  const appstore = createAppStore()

  return (
    <main>
      <div>
        <button onclick={appstore.handleAddNode}>Add new node</button>
      </div>
      <ul class={styles.nodes}>
        <For each={appstore.nodes()}>
          {(node) => (
            <li class={styles.node}>
              <div>
                <button onclick={() => appstore.handleRemoveNode(node.id)}>
                  X
                </button>
                <button
                  aria-selected={appstore.isNodeSelected(node.id)}
                  onclick={() => appstore.handleSelected(node.id)}
                >
                  O
                </button>
              </div>
              <div>{node.id}</div>
              <Attributes
                attributes={node.attrs}
                onchangeEmpty={(name) =>
                  appstore.handleInsertNodeAttribute(node.id, name)
                }
                onchangeName={(prev, next) =>
                  appstore.handleUpdateNodeAttributeName(node.id, prev, next)
                }
                onchangeValue={(name, value) =>
                  appstore.handleUpdateNodeAttributeValue(node.id, name, value)
                }
              />
            </li>
          )}
        </For>
      </ul>
      <ul>
        <For each={appstore.edges()}>
          {(edge) => (
            <li>
              <div>
                <button onclick={() => appstore.handleDeleteEdge(edge)}>
                  X
                </button>
              </div>
              <div>
                <div>Source: {edge.source}</div>
                <div>Target: {edge.target}</div>
              </div>
              <Attributes
                attributes={edge.attributes}
                onchangeEmpty={(name) =>
                  appstore.handleInsertEdgeAttribute(edge, name)
                }
                onchangeName={(_prev, next) =>
                  appstore.handleUpdateEdgeAttributeName(edge, next)
                }
                onchangeValue={(name, value) =>
                  appstore.handleUpdateEdgeAttributeValue(edge, name, value)
                }
              />
            </li>
          )}
        </For>
      </ul>
    </main>
  )
}

export interface AttributesProps {
  attributes: Array<Record<"name" | "value", string>>
  onchangeEmpty?(name: string): void
  onchangeName?(prev: string, next: string): void
  onchangeValue?(name: string, value: string): void
}

export function Attributes(props: AttributesProps) {
  return (
    <ul>
      <For each={props.attributes}>
        {(attr) => (
          <li>
            <input
              type="text"
              value={attr.name}
              onchange={(event) =>
                props.onchangeName?.(attr.name, event.currentTarget.value)
              }
            />
            <input
              type="text"
              value={attr.value}
              onchange={(event) =>
                props.onchangeValue?.(attr.name, event.currentTarget.value)
              }
            />
          </li>
        )}
      </For>
      <li>
        <input
          type="text"
          placeholder="Attribute name"
          onchange={(event) => props.onchangeEmpty?.(event.currentTarget.value)}
        />
      </li>
    </ul>
  )
}
