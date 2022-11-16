This is an implementation of the reference 'Cloak of Darkness' interactive
fiction story. See https://www.ifwiki.org/Cloak_of_Darkness#Notable_Features for
details and for implementations using other interactive fiction frameworks

Text gratefully copied from the reference chapbook example by Chris Klimas
https://github.com/klembot (based on an example by Roger Firth)
https://github.com/klembot/chapbook/blob/main/examples/cloak-of-darkness.txt which is playable at
https://klembot.github.io/chapbook/examples/cloak-of-darkness.html

See also e.g. https://linusakesson.net/dialog/cloak/cloak-rel1.dg

This demonstrates how regular Typescript generators, combined with JSX, can
provide a practical editing experience and execution model for interactive
stories, in this case having just `tell` (a page) or `prompt` (a choice) as
primitive steps in a story sequence, a repertoire that can easily be extended.

The [story](./src/stories/cloak-of-darkness/content.tsx) is simply imperative
Typescript, exploiting generators as 'resumable' procedures.
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator

The type-safety of Typescript gives auto-completion and compile-time checks
for typos in room names or choice logic.

An author also benefits from JSX editing and formatting, which assumes, for
example that whitespace can be ignored within fragments. In an editor with
prettier, this auto-formats all text into neatly-wrapped lines on save.

Stepping outside the expressivity of an IF parser, and the limited structures it
expresses, this approach allows arbitrary logic and presentation. For example instead
of a simple state object, you could use a full-blown store like @lauf/store-react,
Zustand or Jotai to control the render of e.g. inventory or health via icons and bars in a
specialised UI.

Most text in the story is merely JSX fragments like <>My text</> (having no
HTML elements) but tell and prompt Passages can in fact be any JSX content,
including e.g. images, tables or whatever.

N.B. A linting rule would be useful to avoid potentially calling `tell` not
`yield* tell` by mistake. This would otherwise present as a silent failure as the
consumer (UI) of the generated story would not get yielded that content.
