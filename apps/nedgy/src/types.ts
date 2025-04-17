export type AttributeName = string
export type AttributeValue = string

export type Id = string
export type Attrs = Array<Attr>

export interface Attr {
  name: AttributeName
  value: AttributeValue
}
