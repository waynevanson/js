export type AttributeName = string
export type AttributeValue = string

export type Id = string
export type Attributes = Record<AttributeName, AttributeValue>

export interface Attr {
  name: AttributeName
  value: AttributeValue
}
