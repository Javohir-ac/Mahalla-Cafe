declare module 'react-scroll' {
  import * as React from 'react'

  export interface LinkProps {
    to: string
    spy?: boolean
    smooth?: boolean
    offset?: number
    duration?: number
    delay?: number
    isDynamic?: boolean
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
    children?: React.ReactNode
    className?: string
    activeClass?: string
    hashSpy?: boolean
    spyThrottle?: number
    saveHashHistory?: boolean
    excludeOffset?: boolean
    excludeFromSpy?: boolean
  }

  export class Link extends React.Component<LinkProps> {}

  export interface ElementProps {
    name: string
    children?: React.ReactNode
    className?: string
  }

  export class Element extends React.Component<ElementProps> {}

  export function scroller(): any
  export function Events(): any
  export function scrollSpy(): any
  export function animateScroll(): any
}
