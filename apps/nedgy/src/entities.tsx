import { Accessor, For } from "solid-js"
import { JSX } from "solid-js/jsx-runtime"
import { Id, AttributeName, Attr } from "./types"
import styles from "./entities.module.css"
import { Attributes } from "./attributes"

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
