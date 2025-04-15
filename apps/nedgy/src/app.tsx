// todo: worry less about looks and make it functional.
import { createMemo, createSelector, createSignal, For } from "solid-js"
import { createStore, produce } from "solid-js/store"
import { v7 as uuid } from "uuid"
import styles from "./app.module.css"

export type AttributeName = string
export type AttributeValue = string

export type Id = string
export type Attributes = Record<AttributeName, AttributeValue>

export interface Attr {
  name: AttributeName
  value: AttributeValue
}

export interface AppStore {
  nodes: Record<Id, Id>
  edges: Record<Id, Record<Id, Set<Id>>>
  attributes: Record<Id, Attributes>
  selecting: Id | undefined
}

export function createAppStore() {
  const [store, storeSet] = createStore<AppStore>({
    selecting: undefined,
    nodes: {},
    edges: {},
    attributes: {},
  })

  const isNodeSelected = createSelector(() => store.selecting)

  const nodes = createMemo(() =>
    Object.entries(store.nodes)
      .map(([nodeId, attributeId]) => ({
        nodeId,
        attributeId,
        attrs: Object.entries(store.attributes[attributeId]).map(
          ([name, value]) => ({
            name,
            value,
          }),
        ),
      }))
      .sort((left, right) => left.attributeId.localeCompare(right.attributeId)),
  )

  const edges = createMemo(() =>
    Object.entries(store.edges)
      .flatMap(([sourceNodeId, targetIds]) =>
        Object.entries(targetIds).flatMap(([targetNodeId, attributeIds]) =>
          Array.from(attributeIds).map((attributeId) => ({
            sourceNodeId,
            targetNodeId,
            attributeId,
            attrs: Object.entries(store.attributes[attributeId]).map(
              ([name, value]) => ({ name, value }),
            ),
          })),
        ),
      )
      .sort((left, right) => left.attributeId.localeCompare(right.attributeId)),
  )

  function handleAddNode() {
    const nodeId = uuid()
    const attributeId = uuid()

    storeSet(
      produce((store) => {
        store.nodes[nodeId] = attributeId
        store.attributes[attributeId] = { "": "" }

        return store
      }),
    )
  }

  function handleSelected(nodeId: Id) {
    // double clicked same node, deselect
    if (store.selecting === undefined) {
      storeSet("selecting", nodeId)
      return
    }

    storeSet(
      produce((store) => {
        // store
        const selecting = store.selecting

        // deselect
        store.selecting = undefined

        // clicked another node, create edge
        if (selecting === nodeId) return

        if (!store.edges.hasOwnProperty(selecting!)) {
          store.edges[selecting!] = {}
        }

        if (!store.edges[selecting!][nodeId]) {
          store.edges[selecting!][nodeId] = new Set()
        }

        const weightId = uuid()

        store.edges[selecting!][nodeId] = new Set(
          store.edges[selecting!][nodeId],
        )

        store.edges[selecting!][nodeId].add(weightId)
        store.attributes[weightId] = { "": "" }
      }),
    )
  }

  function handleRemoveNode(id: Id) {
    storeSet(
      "nodes",
      produce((nodes) => {
        delete nodes[id]
        return nodes
      }),
    )
  }

  function handleDeleteEdge(
    ids: Record<"sourceNodeId" | "targetNodeId" | "attributeId", string>,
  ) {
    storeSet("edges", ids.sourceNodeId, ids.targetNodeId, (attributeIds) => {
      attributeIds = new Set(attributeIds)
      attributeIds.delete(ids.attributeId)
      return attributeIds
    })

    storeSet(
      "attributes",
      produce((weight) => {
        delete weight[ids.attributeId]
        return weight
      }),
    )
  }

  function handleUpdateAttributeName(
    attributeId: Id,
    prev: AttributeName,
    next: AttributeName,
  ) {
    storeSet(
      "attributes",
      attributeId,
      produce((attributes) => {
        const value = attributes[prev]
        delete attributes[prev]
        attributes[next] = value

        if (prev === "") {
          attributes[""] = ""
        }
      }),
    )
  }

  function handleUpdateAttributeValue(attributeId: Id, attr: Attr) {
    storeSet("attributes", attributeId, attr.name, attr.value)
  }

  function handleUpdateEdgeAttributeName(
    edge: Record<"sourceNodeId" | "targetNodeId" | "attributeId", string>,
    name: string,
  ) {
    storeSet(
      "attributes",
      edge.attributeId,
      produce((attributes) => {
        const value = attributes[name]
        delete attributes[name]
        attributes[name] = value
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
    handleUpdateAttributeName,
    handleUpdateAttributeValue,
    handleUpdateEdgeAttributeName,
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
              <div>{node.nodeId}</div>
              <NodeControls
                id={node.nodeId}
                selected={appstore.isNodeSelected(node.nodeId)}
                onremove={() => appstore.handleRemoveNode(node.nodeId)}
                onselect={() => appstore.handleSelected(node.nodeId)}
              />
              <Attributes
                attributeId={node.attributeId}
                attributes={node.attrs}
                onchangeName={(prev, next) =>
                  appstore.handleUpdateAttributeName(
                    node.attributeId,
                    prev,
                    next,
                  )
                }
                onchangeValue={(attr) =>
                  appstore.handleUpdateAttributeValue(node.attributeId, attr)
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
                source={edge.sourceNodeId}
                target={edge.targetNodeId}
              />
              <Attributes
                attributeId={edge.attributeId}
                attributes={edge.attrs}
                onchangeName={(prev, next) =>
                  appstore.handleUpdateAttributeName(
                    edge.attributeId,
                    prev,
                    next,
                  )
                }
                onchangeValue={(attr) =>
                  appstore.handleUpdateAttributeValue(edge.attributeId, attr)
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
    <div class={styles["edge-controls"]}>
      <div>
        <button onclick={() => props.onremove()}>X</button>
      </div>
      <div class={styles["edge-controls-liner"]}>
        <div class={styles["edge-controls-graphic"]}>
          <div>&#x2022;</div>
          <div class={styles["edge-line"]} />
          <div>&#x2022;</div>
        </div>
        <div class={styles["edge-controls-info"]}>
          <div>{props.source}</div>
          <div>{props.target}</div>
        </div>
      </div>
    </div>
  )
}

export interface AttributesProps {
  attributeId: Id
  attributes: Array<Attr>
  onchangeName?(prev: AttributeName, name: AttributeName): void
  onchangeValue?(attr: Attr): void
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
                props.onchangeValue?.({
                  name: attr.name,
                  value: event.currentTarget.value,
                })
              }
            />
          </li>
        )}
      </For>
    </ul>
  )
}
