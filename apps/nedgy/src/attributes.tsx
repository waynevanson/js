import { For } from "solid-js"
import { Id, AttributeName, Attr } from "./types"
import styles from "./attributes.module.css"

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
              placeholder="Name"
              onchange={(event) =>
                props.onchangeName?.(
                  props.attributeId,
                  attr.name,
                  event.currentTarget.value,
                )
              }
            />
            <input
              placeholder="Value"
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
