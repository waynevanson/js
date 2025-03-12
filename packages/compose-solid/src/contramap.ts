import { createMemo, createComponent } from "solid-js"
import type {
  OuterPropsKind,
  ComposedComponent,
  TagKind,
  ComposedComponentProps,
  ComposedMonomorphicComponent,
  ComposedMonomorphicProps,
  ComposedPolymorphicProps,
  ComposedPolymorphicComponent,
} from "./types.js"

export function contramap<
  Tag extends TagKind,
  PrevOuterProps extends OuterPropsKind,
  NextOuterProps extends OuterPropsKind,
  As extends TagKind = Tag,
>(
  component: ComposedPolymorphicComponent<Tag, PrevOuterProps>,
  fn: (
    next: ComposedPolymorphicProps<As, NextOuterProps>,
  ) => ComposedPolymorphicProps<As, PrevOuterProps>,
): ComposedPolymorphicComponent<Tag, NextOuterProps>

export function contramap<
  Tag extends TagKind,
  PrevOuterProps extends OuterPropsKind,
  NextOuterProps extends OuterPropsKind,
>(
  component: ComposedMonomorphicComponent<Tag, PrevOuterProps>,
  fn: (
    next: ComposedMonomorphicProps<Tag, NextOuterProps>,
  ) => ComposedMonomorphicProps<Tag, PrevOuterProps>,
): ComposedMonomorphicComponent<Tag, NextOuterProps>

export function contramap<
  Tag extends TagKind,
  PrevOuterProps extends OuterPropsKind,
  NextOuterProps extends OuterPropsKind,
>(
  component: ComposedMonomorphicComponent<Tag, PrevOuterProps>,
  fn: (
    next: ComposedMonomorphicProps<Tag, NextOuterProps>,
  ) => ComposedMonomorphicProps<Tag, PrevOuterProps>,
): ComposedComponent<Tag, NextOuterProps> {
  return function PolymorphicContramapComponent<As extends TagKind = Tag>(
    next: ComposedMonomorphicProps<As, NextOuterProps>,
  ) {
    const props = createMemo(() => fn(next))
    return createComponent(component as never, props())
  }
}
