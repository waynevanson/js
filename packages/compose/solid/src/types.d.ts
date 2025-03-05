import { JSX } from "solid-js"

export type TagKind = keyof JSX.IntrinsicElements
export type PropsKind = Record<string, unknown>
export type OuterPropsKind = PropsKind

// we need to keep track of:
// 1. The tag or reference element.
// 2. the props we started with.
// 3. the props we end up with.
// 4. `as`. When we apply polymorphism,
//     1. change the target element.
//     2. change the target props.
//     3. ensure source prop restrictions can be applied.
//     4. lets do one at a time and see how it goes
export interface PolymorphicComponent<
  Tag extends TagKind,
  OuterProps extends OuterPropsKind = {}
> {
  <As extends TagKind = Tag>(
    props: PolymorphicComponentProps<As, OuterProps>
  ): JSX.Element
}

// matching property
// (previous, next, outer)
//
// (optional, required, none)
// (optional, none, required)
// (required, optional, none)
// (required, none, optional)
// (none, required, optional)
// (none, optional, required)
// (optional, required, required)
// (optional, none, none)
// (required, optional, optional)
// (required, none, none)
// (none, required, required)
// (none, optional, optional)
// (optional, optional, required)
// (optional, optional, none)
// (required, required, none)
// (required, required, optional)
// (none, none, required)
// (none, none, optional)
// (optional, optional, optional)
// (required, required, required)
// (none, none, none)
export type PolymorphicComponentProps<
  As extends TagKind,
  OuterProps extends OuterPropsKind
> = Substitute<JSX.IntrinsicElements[As], OuterProps> & { as?: As }

export type Substitute<Left extends object, Right extends object> = FastOmit<
  Left,
  keyof Right
> &
  Right

export type FastOmit<T extends object, U extends string | number | symbol> = {
  [K in keyof T as K extends U ? never : K]: T[K]
}
