// @ts-expect-error
import spring, { toString } from 'css-spring'

export type SpringOption = {
  precision?: number
  preset?: 'stiff' | 'gentle' | 'wobbly' | 'noWobble'
  stiffness?: number
  damping?: number
}

export const genSpringKeyframes = (
  name: string,
  from: any,
  to: any,
  options: SpringOption = { preset: 'gentle' },
) => {
  const transformProperty = [
    'translateX',
    'translateY',
    'translateZ',
    'scale',
    'rotate',
  ]
  const keyframes = toString(
    spring(from, to, options),
    (property: any, value: any) =>
      transformProperty.includes(property)
        ? `transform: ${property}(${value});`
        : `${property}:${value};`,
  )

  const css = document.createElement('style')
  css.innerHTML = `@keyframes ${name} {${keyframes}}`

  // return [name, css, keyframes] as const

  return { name, css, keyframes }
}
