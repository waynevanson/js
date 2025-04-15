// todo: worry less about looks and make it functional.
import { createMemo, createSelector, For } from "solid-js"
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
    storeSet("nodes", { [uuid()]: {} })
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
      <ul class={styles.entities}>
        <For each={appstore.nodes()}>
          {(node) => (
            <li class={styles.entity}>
              <div>{node.id}</div>
              <NodeControls
                id={node.id}
                selected={appstore.isNodeSelected(node.id)}
                onremove={() => appstore.handleRemoveNode(node.id)}
                onselect={() => appstore.handleSelected(node.id)}
              />
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
      <ul class={styles.entities}>
        <For each={appstore.edges()}>
          {(edge) => (
            <li class={styles.entity}>
              <EdgeControls
                onremove={() => appstore.handleDeleteEdge(edge)}
                source={edge.source}
                target={edge.target}
              />
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

export interface NodeControlsProps {
  id: string
  selected: boolean
  onremove(): void
  onselect(): void
}

export function NodeControls(props: NodeControlsProps) {
  return (
    <div>
      <button onclick={() => props.onremove()}>X</button>
      <button aria-selected={props.selected} onclick={() => props.onselect()}>
        O
      </button>
    </div>
  )
}

export interface EdgeControlsProps {
  source: string
  target: string
  onremove(): void
}

export function EdgeControls(props: EdgeControlsProps) {
  return (
    <div>
      <div>
        <button onclick={() => props.onremove()}>X</button>
      </div>
      <div>
        <div>Source: {props.source}</div>
        <div>Target: {props.target}</div>
      </div>
    </div>
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
    <ul class={styles.attributes}>
      <For each={props.attributes}>
        {(attr) => (
          <li class={styles.attribute}>
            <input
              class={styles["attribute-name"]}
              type="text"
              value={attr.name}
              onchange={(event) =>
                props.onchangeName?.(attr.name, event.currentTarget.value)
              }
            />
            <input
              class={styles["attribute-value"]}
              type="text"
              value={attr.value}
              onchange={(event) =>
                props.onchangeValue?.(attr.name, event.currentTarget.value)
              }
            />
          </li>
        )}
      </For>
      <li class={styles.attribute}>
        <input
          type="text"
          placeholder="Attribute name"
          onchange={(event) => props.onchangeEmpty?.(event.currentTarget.value)}
        />
      </li>
    </ul>
  )
}
