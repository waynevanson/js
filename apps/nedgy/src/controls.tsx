import { Show } from "solid-js"
import styles from "./controls.module.css"
import { MinusCircle, Pause, Play } from "./icons"

export interface NodeControlsProps {
  id: string
  selected: boolean
  onremove(): void
  onselect(): void
}

export function NodeControls(props: NodeControlsProps) {
  return (
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
