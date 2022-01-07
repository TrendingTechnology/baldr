export interface DOMEvent<T extends EventTarget> extends Event {
  target: T
}

export interface Person {
  firstName: string
  lastName: string
  seatNo: number
  id: string
}

export interface Seat {
  no: number
  x: number
  y: number
}

export interface RoomDimension {
  width: number
  depth: number
}

export interface Room {
  roomWidth: number
  roomDepth: number
  aisle: number
  dimension: RoomDimension
  count: number
  positions: {
    [key: number]: Seat
  }
}

export default {}
