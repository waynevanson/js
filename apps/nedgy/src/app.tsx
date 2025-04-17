// todo: worry less about looks and make it functional.
// todo: create to show only attrs
import { makePersisted } from "@solid-primitives/storage"
import { createMemo, createSelector, For } from "solid-js"
import { createStore, produce } from "solid-js/store"
import { v7 as uuid } from "uuid"
import { EdgeControls, NodeControls } from "./controls"
import { Entities } from "./entities"
import { AttributeName, AttributeValue, Attrs, Id } from "./types"

export function App() {
  const appstore = createAppStore()

  const filters = createMemo(() =>
    Object.entries(
      Object.values(appstore.store.weights).reduce(
        (prev, attrs) => {
          for (const attr of attrs) {
            if (attr.name === "") continue

            if (!prev.hasOwnProperty(attr.name)) {
              prev[attr.name] = []
            }

            if (!prev[attr.name].includes(attr.value)) {
              prev[attr.name].push(attr.value)
            }
          }

          return prev
        },
        {} as Record<AttributeName, Array<AttributeValue>>,
      ),
    ).map(([label, values]) => ({ label, values })),
  )

  function handleFilterUpdate(
    params: { label: string; value: string } | undefined,
  ) {
    appstore.stateSet("filter", params)
  }

  return (
    <main>
      <div>
        <button onclick={appstore.handleAddNode}>Add new node</button>
        <p>Filter</p>
        <select>
          <For each={filters()}>
            {(filter) => (
              <optgroup>
                <For each={filter.values}>
                  {(value) => (
                    <option
                      onclick={() =>
                        handleFilterUpdate({ label: filter.label, value })
                      }
                    >
                      {value}
                    </option>
                  )}
                </For>
              </optgroup>
            )}
          </For>
        </select>
      </div>

      <h2>Nodes</h2>
      <Entities
        entities={appstore.nodes()}
        onchangeName={appstore.handleUpdateAttributeName}
        onchangeValue={appstore.handleUpdateAttributeValue}
      >
        {(node) => (
          <NodeControls
            id={node.nodeId}
            selected={appstore.isNodeSelected(node.nodeId)}
            onremove={() =>
              appstore.handleRemoveNode(node.nodeId, node.weightId)
            }
            onselect={() => appstore.handleSelected(node.nodeId)}
          />
        )}
      </Entities>

      <h2>Edges</h2>
      <Entities
        entities={appstore.edges()}
        onchangeName={appstore.handleUpdateAttributeName}
        onchangeValue={appstore.handleUpdateAttributeValue}
      >
        {(edge, index) => (
          <EdgeControls
            onremove={() => appstore.handleDeleteEdge(edge, index())}
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
  edges: Record<Id, Record<Id, Array<Id>>>
  weights: Record<Id, Attrs>
}

export function createAppStore() {
  const [state, stateSet] = createStore<{
    selecting: undefined | Id
    filter: undefined | { label: AttributeName; value: AttributeValue }
  }>({
    selecting: undefined,
    filter: undefined,
  })

  const [store, storeSet] = makePersisted(
    createStore<AppStore>({
      nodes: {},
      edges: {},
      weights: {},
    }),
    { name: "app-store" },
  )

  const isNodeSelected = createSelector(() => state.selecting)

  // todo: apply filter
  const nodes = createMemo(() =>
    Object.entries(store.nodes).map(([nodeId, weightId]) => ({
      nodeId,
      weightId,
      attrs: store.weights[weightId],
    })),
  )

  // todo: apply filter
  const edges = createMemo(() =>
    Object.entries(store.edges).flatMap(([sourceNodeId, targetIds]) =>
      Object.entries(targetIds).flatMap(([targetNodeId, weightIds]) =>
        Array.from(weightIds).map((weightId) => ({
          sourceNodeId,
          targetNodeId,
          weightId,
          attrs: store.weights[weightId],
        })),
      ),
    ),
  )

  function handleAddNode() {
    const nodeId = uuid()
    const weightId = uuid()

    storeSet(
      produce((store) => {
        store.nodes[nodeId] = weightId

        if (!store.weights.hasOwnProperty(weightId)) {
          store.weights[weightId] = []
        }

        store.weights[weightId].push({ name: "", value: "" })

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

    // select
    const selecting = state.selecting

    // deselect
    stateSet("selecting", undefined)
    if (selecting === nodeId) return

    storeSet(
      produce((store) => {
        // clicked another node, create edge

        if (!store.edges.hasOwnProperty(selecting!)) {
          store.edges[selecting!] = {}
        }

        if (!store.edges[selecting!][nodeId]) {
          store.edges[selecting!][nodeId] = []
        }

        const weightId = uuid()

        store.edges[selecting!][nodeId].push(weightId)

        // add an initial weight
        if (!store.weights.hasOwnProperty(weightId)) {
          store.weights[weightId] = []
        }

        store.weights[weightId].push({ name: "", value: "" })
      }),
    )
  }

  function handleRemoveNode(nodeId: Id, weightId: Id) {
    storeSet(
      "nodes",
      produce((nodes) => {
        delete nodes[nodeId]
        return nodes
      }),
    )

    storeSet(
      "weights",
      produce((weight) => {
        delete weight[weightId]
        return weight
      }),
    )
  }

  function handleDeleteEdge(
    ids: Record<"sourceNodeId" | "targetNodeId" | "weightId", string>,
    index: number,
  ) {
    storeSet("edges", ids.sourceNodeId, ids.targetNodeId, (attributeIds) => {
      attributeIds.splice(index, 1)
      return attributeIds
    })

    storeSet(
      "weights",
      produce((weight) => {
        delete weight[ids.weightId]
        return weight
      }),
    )
  }

  // if there are no empties, then create
  function handleUpdateAttributeName(params: {
    weightId: Id
    index: number
    name: AttributeName
  }) {
    storeSet("weights", params.weightId, params.index, "name", params.name)

    if (store.weights[params.weightId].every((weight) => weight.name !== "")) {
      storeSet(
        "weights",
        params.weightId,
        produce((attrs) => {
          attrs.push({ name: "", value: "" })
        }),
      )
    }
  }

  function handleUpdateAttributeValue(params: {
    weightId: Id
    index: number
    value: AttributeValue
  }) {
    storeSet("weights", params.weightId, params.index, "value", params.value)
  }

  return {
    store,
    storeSet,
    state,
    stateSet,
    nodes,
    edges,
    handleAddNode,
    handleSelected,
    handleRemoveNode,
    isNodeSelected,
    handleDeleteEdge,
    handleUpdateAttributeName,
    handleUpdateAttributeValue,
  }
}
