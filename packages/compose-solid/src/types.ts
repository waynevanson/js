import { JSX } from "solid-js"

export type TagKind = keyof JSX.IntrinsicElements
export type PropsKind = Record<string, unknown>
export type OuterPropsKind = object

export type ComposedComponent<
  Tag extends TagKind,
  OuterProps extends OuterPropsKind
> =
  | ComposedMonomorphicComponent<Tag, OuterProps>
  | ComposedPolymorphicComponent<Tag, OuterProps>

export type ComposedComponentProps<
  Tag extends TagKind,
  OuterProps extends OuterPropsKind
> =
  | ComposedMonomorphicProps<Tag, OuterProps>
  | ComposedPolymorphicProps<Tag, OuterProps>

export interface ComposedPolymorphicComponent<
  Tag extends TagKind,
  OuterProps extends OuterPropsKind
> {
  <As extends TagKind = Tag>(
    props: ComposedPolymorphicProps<As, OuterProps>
  ): JSX.Element
}

export type ComposedPolymorphicProps<
  Tag extends TagKind,
  OuterProps extends OuterPropsKind
> = Substitute<ComposedMonomorphicProps<TagKind, OuterProps>, { as?: Tag }>

export interface ComposedMonomorphicComponent<
  Tag extends TagKind,
  OuterProps extends OuterPropsKind
> {
  (props: ComposedMonomorphicProps<Tag, OuterProps>): JSX.Element
}

export type ComposedMonomorphicProps<
  Tag extends TagKind,
  OuterProps extends OuterPropsKind
> = Substitute<JSX.IntrinsicElements[Tag], OuterProps>

export type Substitute<Left extends object, Right extends object> = FastOmit<
  Left,
  keyof Right
> &
  Right

export type FastOmit<T extends object, U extends string | number | symbol> = {
  [K in keyof T as K extends U ? never : K]: T[K]
}
