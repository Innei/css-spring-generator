'use client'
import { useUncontrolledInput } from '@/hooks/use-uncontrolled-input'
import { genSpringKeyframes, type SpringOption } from '@/lib/spring'
import { useLayoutEffect, useRef, useState } from 'react'
import { Input, StyledButton, TextArea } from 'shiro-rc'
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter'
import github from 'react-syntax-highlighter/dist/esm/styles/hljs/github'
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css'

SyntaxHighlighter.registerLanguage('css', css)

export default function Home() {
  const [, getFrom, ref1] = useUncontrolledInput<HTMLTextAreaElement>(
    `{ translateY: '3em', opacity: 0 }`,
  )
  const [, getTo, ref2] = useUncontrolledInput<HTMLTextAreaElement>(
    `{ translateY: '0em', opacity: 1 }`,
  )

  const [, damping, ref4] = useUncontrolledInput<HTMLInputElement>('14')
  const [, stiffness, ref5] = useUncontrolledInput<HTMLInputElement>('120')
  const [, precision, ref6] = useUncontrolledInput<HTMLInputElement>()

  const [, getName, ref3] = useUncontrolledInput('bottom-up')

  const ballRef = useRef<HTMLDivElement>(null)
  const [cssKeyframes, setCssKeyframes] = useState('')
  const prevCssElement = useRef<HTMLStyleElement | null>(null)

  const buttonRef = useRef<HTMLButtonElement>(null)
  useLayoutEffect(() => {
    buttonRef.current?.click()
  }, [])

  return (
    <div className="max-w-[80ch] mx-auto h-dvh flex flex-col">
      <h1 className="mt-24 font-bold leading-loose text-3xl text-center">
        CSS Spring Keyframe Generator
      </h1>
      <div className="mt-12 flex gap-6 mx-auto items-center justify-center w-full">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 grid-rows-2 gap-4">
              <Input ref={ref3} placeholder="name" />
              <Input ref={ref4} placeholder="Damping" />
              <Input ref={ref5} placeholder="Stiffness" />
              <Input ref={ref6} placeholder="Precision" />
            </div>
            <TextArea
              className="h-[80px]"
              placeholder="Enter from property"
              ref={ref1}
            ></TextArea>
            <TextArea
              className="h-[80px]"
              placeholder="Enter to property"
              ref={ref2}
            ></TextArea>
          </div>
          <StyledButton
            ref={buttonRef}
            onClick={() => {
              const name = getName()
              const from = getFrom()
              const to = getTo()

              if (!name || !from || !to) {
                return
              }

              const options = {} as SpringOption

              if (damping()) {
                options.damping = Number(damping())
              }

              if (stiffness()) {
                options.stiffness = Number(stiffness())
              }

              if (precision()) {
                options.precision = Number(precision())
              }

              const { css } = genSpringKeyframes(
                name,
                new Function(`return  ${from}`)(),
                new Function(`return  ${to}`)(),
                {
                  ...options,
                },
              )

              setCssKeyframes(css.innerHTML)

              const ball = ballRef.current
              ball?.style.setProperty('animation', `${name} 1s linear infinite`)

              if (prevCssElement.current) {
                document.head.removeChild(prevCssElement.current)
              }
              document.head.appendChild(css)
              prevCssElement.current = css
            }}
          >
            Generate and preview
          </StyledButton>
        </div>
        <div className="w-1/4 flex justify-center">
          <div ref={ballRef} className="size-6 rounded-full bg-accent"></div>
        </div>
      </div>
      {cssKeyframes && (
        <div className="mt-6">
          <SyntaxHighlighter language="css" style={github}>
            {cssKeyframes}
          </SyntaxHighlighter>
        </div>
      )}

      <footer className="grow flex items-end pb-6">
        <div className="flex items-center text-base-content/60 whitespace-pre justify-center w-full text-sm">
          <span className="whitespace-pre">2024 © </span>
          <a href="https://github.com/innei" target="_blank">
            Innei
          </a>
          . Credit to{' '}
          <a href="https://github.com/codepunkt/css-spring">css-spring</a>
        </div>
      </footer>
    </div>
  )
}
