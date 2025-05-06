import { JSX } from "solid-js"

export type TagKind = keyof JSX.IntrinsicElements
export type PropsKind = Record<string, unknown>
export type OuterPropsKind = object

export interface ComposedPolymorphicComponent<
  Tag extends TagKind,
  OuterProps extends OuterPropsKind,
> extends ComposedMonomorphicComponent<Tag, OuterProps> {
  <As extends TagKind = Tag>(
    props: ComposedPolymorphicProps<As, OuterProps>,
  ): JSX.Element
}

export type ComposedPolymorphicProps<
  Tag extends TagKind,
  OuterProps extends OuterPropsKind,
> = Substitute<ComposedMonomorphicProps<Tag, OuterProps>, { as?: Tag }>

export interface ComposedMonomorphicComponent<
  Tag extends TagKind,
  OuterProps extends OuterPropsKind,
> {
  (props: ComposedMonomorphicProps<Tag, OuterProps>): JSX.Element
}

/**
 * @summary Replaces the props of the element with the new props.
 */
export type ComposedMonomorphicProps<
  Tag extends TagKind,
  OuterProps extends OuterPropsKind,
> = Substitute<JSX.IntrinsicElements[Tag], OuterProps>

/**
 * @summary
 * Replaces the keys of left with the keys of right.
 */
export type Substitute<Left extends object, Right extends object> = FastOmit<
  Left,
  keyof Right
> &
  Right

/**
 * @summary
 * Just like the built in `Omit` type but faster!
 */
export type FastOmit<T extends object, U extends PropertyKey> = {
  [K in keyof T as K extends U ? never : K]: T[K]
}
