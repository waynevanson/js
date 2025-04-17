import { Accessor, For } from "solid-js"
import { JSX } from "solid-js/jsx-runtime"
import { Attributes } from "./attributes"
import styles from "./entities.module.css"
import { Attr, AttributeName, AttributeValue, Id } from "./types"

export interface EntitiesPropsItem {
  weightId: Id
  attrs: Array<Attr>
}

export interface EntitiesProps<T extends EntitiesPropsItem> {
  children(itemised: T, index: Accessor<number>): JSX.Element
  entities: Array<T>
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

export function Entities<T extends EntitiesPropsItem>(props: EntitiesProps<T>) {
  return (
    <ul class={styles.entities}>
      <For each={props.entities}>
        {(entity, index) => (
          <li class={styles.entity}>
            {props.children(entity, index)}
            <Attributes
              weightId={entity.weightId}
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
