// todo: worry less about looks and make it functional.
import { makePersisted } from "@solid-primitives/storage"
import { createMemo, createSelector } from "solid-js"
import { createStore, produce } from "solid-js/store"
import { v7 as uuid } from "uuid"
import { EdgeControls, NodeControls } from "./controls"
import { Entities } from "./entities"
import { Attr, AttributeName, Attributes, Id } from "./types"
import styles from "./app.module.css"

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

export interface AppStore {
  nodes: Record<Id, Id>
  edges: Record<Id, Record<Id, Set<Id>>>
  // todo: call it weights, because inside it stores attributes
  attributes: Record<Id, Attributes>
}

export function createAppStore() {
  const [state, stateSet] = createStore<{ selecting: undefined | Id }>({
    selecting: undefined,
  })

  const [store, storeSet] = makePersisted(
    createStore<AppStore>({
      nodes: {},
      edges: {},
      attributes: {},
    }),
    { name: "app-store" },
  )

  const isNodeSelected = createSelector(() => state.selecting)

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
    // select a node
    if (state.selecting === undefined) {
      stateSet("selecting", nodeId)
      return
    }

    storeSet(
      produce((store) => {
        // store
        const selecting = state.selecting

        // deselect
        stateSet("selecting", undefined)

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
