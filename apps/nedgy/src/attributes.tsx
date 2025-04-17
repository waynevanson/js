import { For } from "solid-js"
import styles from "./attributes.module.css"
import { Attr, AttributeName, AttributeValue, Id } from "./types"

export interface AttributesProps {
  weightId: Id
  attrs: Array<Attr>
  onchangeName?(params: {
    weightId: Id
    index: number
    name: AttributeName
  }): void
  onchangeValue?(param: {
    weightId: Id
    index: number
    value: AttributeValue
  }): void
}

export function Attributes(props: AttributesProps) {
  return (
    <ul class={styles.attributes}>
      <For each={props.attrs}>
        {(attr, index) => (
          <li class={styles.attribute}>
            <input
              class={styles["attribute-name"]}
              type="text"
              value={attr.name}
              placeholder="Name"
              onchange={(event) =>
                props.onchangeName?.({
                  index: index(),
                  name: event.currentTarget.value,
                  weightId: props.weightId,
                })
              }
            />
            <input
              placeholder="Value"
              class={styles["attribute-value"]}
              type="text"
              value={attr.value}
              onchange={(event) =>
                props.onchangeValue?.({
                  index: index(),
                  value: event.currentTarget.value,
                  weightId: props.weightId,
                })
              }
            />
          </li>
        )}
      </For>
    </ul>
  )
}
