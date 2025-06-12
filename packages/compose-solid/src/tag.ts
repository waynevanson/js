import type { ComposedPolymorphicComponent, TagKind } from "./types.js"
import { createDynamic } from "solid-js/web"
import { splitProps } from "solid-js"

/**
 * @summary
 * Creates a component with the element's tag predefined
 *
 * @description
 *
 * @param tag
 * @returns A polymorphic component, where `as` is a reserved keyword for changing the component name.
 *
 * @example
 * const Main = tag('main')
 *
 * export function MyApp() {
 *   return (
 *     <Main>
 *       I'm the main content!
 *     </Main>
 *   )
 * }
 */
export function tag<Tag extends TagKind>(
  tag: Tag,
): ComposedPolymorphicComponent<Tag, Record<never, never>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function PolymorphicTagComponent(props: any) {
    const [, rest] = splitProps(props, ["as"])
    return createDynamic(() => props.as || tag, rest)
  }
}
