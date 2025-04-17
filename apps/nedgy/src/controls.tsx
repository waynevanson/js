import { Show } from "solid-js"
import styles from "./controls.module.css"
import { MinusCircle, Pause, Play } from "./icons"

const ID_LENGTH = 3

export interface NodeControlsProps {
  id: string
  selected: boolean
  onremove(): void
  onselect(): void
}

export function NodeControls(props: NodeControlsProps) {
  return (
    <div class={styles["node-panel-header"]}>
      <p class={styles["node-panel-title"]}>{props.id.slice(-ID_LENGTH)}</p>
      <div class={styles["node-controls"]}>
        <button onclick={() => props.onremove()}>
          <MinusCircle />
        </button>
        <button aria-selected={props.selected} onclick={() => props.onselect()}>
          <Show when={props.selected} fallback={<Play />}>
            <Pause />
          </Show>
        </button>
      </div>
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
    <div class={styles["node-panel-header"]}>
      <p class={styles["node-panel-title"]}>
        {props.source.slice(-ID_LENGTH)} -&gt; {props.target.slice(-ID_LENGTH)}
      </p>
      <div class={styles["node-controls"]}>
        <button onclick={() => props.onremove()}>
          <MinusCircle />
        </button>
      </div>
    </div>
  )
}

export interface EdgeControlsProps {
  source: string
  target: string
  onremove(): void
}
