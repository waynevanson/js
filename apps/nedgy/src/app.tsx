// todo: worry less about looks and make it functional.
import {
  Accessor,
  children,
  createMemo,
  createSelector,
  createSignal,
  For,
  JSX,
  splitProps,
} from "solid-js"
import { createStore, produce } from "solid-js/store"
import { v7 as uuid } from "uuid"
import styles from "./app.module.css"
import { makePersisted } from "@solid-primitives/storage"

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
  const [store, storeSet] = makePersisted(
    createStore<AppStore>({
      selecting: undefined,
      nodes: {},
      edges: {},
      attributes: {},
    }),
    { name: "app-store" },
  )

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

export interface EntitiesPropsItem {
  attributeId: Id
  attrs: Array<Attr>
}

export interface EntitiesProps<T extends EntitiesPropsItem> {
  children(itemised: T, index: Accessor<number>): JSX.Element
  entities: Array<T>
  onchangeName?(attributeId: Id, prev: AttributeName, name: AttributeName): void
  onchangeValue?(attributeId: Id, attr: Attr): void
}

export function Entities<T extends EntitiesPropsItem>(props: EntitiesProps<T>) {
  return (
    <ul class={styles.entities}>
      <For each={props.entities}>
        {(entity, index) => (
          <li class={styles.entity}>
            {props.children(entity, index)}
            <Attributes
              attributeId={entity.attributeId}
              attrs={entity.attrs}
              onchangeName={props.onchangeName}
              onchangeValue={props.onchangeValue}
            />
          </li>
        )}
      </For>
    </ul>
  )
}

export function App() {
  const appstore = createAppStore()

  return (
    <main>
      <div>
        <button onclick={appstore.handleAddNode}>Add new node</button>
      </div>

      <Entities
        entities={appstore.nodes()}
        onchangeName={(attributeId, prev, next) =>
          appstore.handleUpdateAttributeName(attributeId, prev, next)
        }
        onchangeValue={(attributeId, attr) =>
          appstore.handleUpdateAttributeValue(attributeId, attr)
        }
      >
        {(node) => (
          <div>
            <div>{node.nodeId}</div>
            <NodeControls
              id={node.nodeId}
              selected={appstore.isNodeSelected(node.nodeId)}
              onremove={() => appstore.handleRemoveNode(node.nodeId)}
              onselect={() => appstore.handleSelected(node.nodeId)}
            />
          </div>
        )}
      </Entities>

      <Entities
        entities={appstore.edges()}
        onchangeName={(attributeId, prev, next) =>
          appstore.handleUpdateAttributeName(attributeId, prev, next)
        }
        onchangeValue={(attributeId, attr) =>
          appstore.handleUpdateAttributeValue(attributeId, attr)
        }
      >
        {(edge) => (
          <EdgeControls
            onremove={() => appstore.handleDeleteEdge(edge)}
            source={edge.sourceNodeId}
            target={edge.targetNodeId}
          />
        )}
      </Entities>
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
  attrs: Array<Attr>
  onchangeName?(attributeId: Id, prev: AttributeName, name: AttributeName): void
  onchangeValue?(attributeId: Id, attr: Attr): void
}

export function Attributes(props: AttributesProps) {
  return (
    <ul class={styles.attributes}>
      <For each={props.attrs}>
        {(attr) => (
          <li class={styles.attribute}>
            <input
              class={styles["attribute-name"]}
              type="text"
              value={attr.name}
              onchange={(event) =>
                props.onchangeName?.(
                  props.attributeId,
                  attr.name,
                  event.currentTarget.value,
                )
              }
            />
            <input
              class={styles["attribute-value"]}
              type="text"
              value={attr.value}
              onchange={(event) =>
                props.onchangeValue?.(props.attributeId, {
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
