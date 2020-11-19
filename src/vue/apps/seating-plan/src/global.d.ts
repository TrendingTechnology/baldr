declare module 'vue-headful'

declare module '@bldr/components-collection'
declare module '@bldr/shortcuts'
declare module '@bldr/icons'
//declare module '@bldr/dynamic-select'
declare module '@bldr/modal-dialog'

interface DOMEvent<T extends EventTarget> extends Event {
  target: T
}

interface Person {
  firstName: string
  lastName: string
  seatNo: number
  id: string
}

interface Seat {
  no: number
  x: number
  y: number
}

interface RoomDimension {
  width: number
  depth: number
}

interface Room {
  roomWidth: number
  roomDepth: number
  aisle: number
  dimension: RoomDimension
  count: number
  positions: {
    [key: number]: Seat
  }
}
