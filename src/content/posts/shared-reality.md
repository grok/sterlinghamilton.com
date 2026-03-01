---
title: Shared Reality with AI
pubDate: "2026-02-16"
lang: en
translationKey: shared-reality-with-ai
---

When you're having a bad time with AI, from my experience it's not a failure of the technology.<br />
It's a failure of being on the same planet, at the same time, in the same space.

The model did exactly what you said. The problem is that what you said wasn't what you meant.

You knew what you wanted. You said something close to it. The model had no way to tell the difference. That has a name: **shared reality**.<br />
Get it right and AI starts to feel like a real collaborator. Get it wrong and you spend your time correcting output that executed flawlessly on the wrong brief.

## TL;DR

AI does exactly what you say, not what you mean. The fix is to build shared reality on purpose: crystallize your spec before you write any code, write tests before you write the implementation, give AI clear roles to work within, and verify the result with a separate model whose only job is to find what the first one missed. Your repo, your prompts, and your process are the spec. Treat them that way.

## A Concrete Example First

You can't run "a play." You run _the_ play.

Every player on the field knows the same terminology, the same routes, the same signals.
If the coach says "run 42" and you run the version of 42 you invented in your head, that's not creativity.
That's a polite way to lose.

Working with AI is exactly this. Except when AI runs the wrong play, it doesn't hesitate or look confused.
It runs the wrong play at full speed, with confidence, and hands you the result like it just won the game.

## What Is Shared Reality?

> **Reality** is the state of everything that exists, not how they might be imagined. <br />
>
> - <cite>Wikipedia[^1]</cite>

[^1]: [Reality](https://en.wikipedia.org/wiki/Reality) on Wikipedia. The article defines reality as the state of everything that actually exists, as distinct from how things might be imagined or perceived. Useful grounding for a concept most people never bother to define.

Humans share reality without thinking about it. Same year. Same gravity. Same vague understanding of what "ship it" means. We fill gaps with context, tone, and history.

AI doesn't have that. It has the context you gave it. That's it.

There's a useful distinction here, between _consensus_ reality and _consensual_ reality.[^2]

[^2]: [Consensus Reality](https://en.wikipedia.org/wiki/Consensus_reality) on Wikipedia. Covers the difference between consensus (the outcome a group lands on) and consensual (the process of actually opting in and agreeing). That distinction is the whole point of this article.

- **Consensus reality** is the outcome: what a group ends up treating as true. It could come from careful alignment, or it could come from one loud person winning the meeting.
- **Consensual reality** is the process: people actually opted in, defined the terms, and agreed on the rules.

What we want with AI is the second one.
Not "I guess we both ended up here." But "we agreed on this, explicitly, on purpose."

Shared reality is the agreement underneath the agreement:

- What do the words mean?
- What does "done" look like?
- What counts as good?

Without it, you're not collaborating. You're just taking turns making noise at each other. 😵

## What Failure Actually Looks Like

Here's a failure mode you probably have a version of already.

You write a prompt. AI returns code. It looks right. Your tests pass. You ship it.
Six weeks later, a user hits an edge case. You dig in and realize the AI solved a slightly different problem than the one you actually had.
It threaded the needle perfectly, on the wrong problem.

You can't even trace where it broke, because there were no checkpoints. No explicit definition of "done." No verification that the output matched the intent.
Just "this looks right" and a commit.

The worst version of this isn't a bug. It's an entire architecture built around a misunderstanding.

Here are a few smaller versions that happen every day:

- You can have agent code that passes tests but isn't working as intended.
- The AI says "mission complete" and it is very much not.
- Commands run with the wrong environment, or inside the wrong sandbox.
- Artifacts pile up in your workspace and never get used.
- You think you're building layered prompt instructions, but every conversation is actually a blank slate.

If you don't have shared reality, you won't know what a good solution looks like until you've already built the bad one.

## Why AI Makes This More Urgent

Humans fail at shared reality too.

We say "done by Friday" and mean "I'll start Thursday night." We hand-wave. We change our minds. We fill gaps with assumptions.

AI doesn't fill gaps with assumptions. It fills gaps with whatever the training data suggests is most likely. Those are not the same thing.

Worse: AI doesn't slow down when confused. It just produces wrong output faster.

Imagine hiring 500 smart interns who can move at machine speed.
Not senior engineers. Not people who already know how you do things.
Smart interns who will confidently do the wrong thing if you're vague.

You'd never rely on vibes with an onboarding wave that big. You'd lay groundwork:

- **Definitions:** What does "ship" mean here, exactly?
- **Standards:** What are the naming conventions, commit formats, and definition of done?
- **Guardrails:** What linting, tests, and CI checks are non-negotiable?
- **Verification:** How do you prove the work is good, and not just that it looks good?

That's not bureaucracy. That's compassion for Future You.

With AI, you can onboard 500 of those interns in an afternoon.
So the cost of skipping that groundwork shows up much, much faster.

## What Good Looks Like

Here's the part people skip: good isn't a vibe. Good is a definition.

If you can't describe what "done" looks like without using the word "looks," you don't have a definition yet.

Here's what that actually looks like, broken into layers:

```mermaid
flowchart TD
  A["Layer 1: Crystallize the spec"] --> B["Layer 2: Write tests first"]
  B --> C["Layer 3: Set up the roles"]
  C --> D["Layer 4: Verify adversarially"]
  D --> E{Gap?}
  E -->|"spec gap"| A
  E -->|"test gap"| B
  E -->|"playbook gap"| C
  E -->|"converged"| F["Done."]
```

**Layer 1: Crystallize the spec.** <br />
Not "done." Provably done - and written down before any code or prompts exist.

That means behavioral contracts (what does this actually do?), interface definitions (what does it take, what does it return?), and an edge case catalog (what are all the ways this can fail?). It also means deciding upfront which properties need formal verification and which just need tests. Not everything requires a proof. But you should know which things do before you start building.

Write the spec before you write the prompt.

**Layer 2: Write tests first. All of them failing.** <br />
A rule in a README is a suggestion. A test is a constraint. The sequence matters.

Write tests that cover your spec, run them, watch them fail - then let AI write the minimum code to make them pass. If you write tests after the code, you're documenting what was built, not verifying what you wanted. The gap between those two is exactly what shared reality is supposed to close.

Linting, CI checks, and any formal verification tools you flagged in Layer 1 go here too. If it matters, make it run. If it runs and fails, nothing ships.

**Layer 3: Set up the roles.** <br />
This is your AGENTS.md, your prompts folder, your style guide, your naming conventions - everything that answers "how do we do things here?"

But it also means being explicit about who does what. Three roles matter: the **Builder** (the AI doing the implementation), the **Adversary** (a separate AI whose only job is to find what the Builder missed), and the **Architect** (you - making strategic calls, not implementation calls). If you don't separate these roles, you end up asking the same model to build and verify its own work. That's not adversarial review. That's asking someone to grade their own exam.

If you don't write the playbook down, AI guesses. If you write it down badly, AI guesses confidently. Write it well, set up the roles, and things start to feel like a team.

**Layer 4: Verify adversarially - with a separate model.** <br />
The best check on AI output is a second pass that assumes the first answer was wrong. And the second pass needs to come from a different model, loaded with fresh context.

This is what VSDD[^3] calls the Adversary - a separate AI (literally named "Sarcasmotron" in the spec) whose only job is to find gaps in the spec, the tests, and the implementation, examined together. Not "does this look right?" but "what is wrong with each of these three things, and where do they fail to match each other?"

The Builder model has been reasoning toward a solution. The Adversary comes in cold and looks for cracks. If your shared reality is solid, adversarial review should bounce off it. If it breaks, you found out before shipping.

[^3]: [Verified Spec-Driven Development (VSDD)](https://gist.github.com/dollspace-gay/d8d3bc3ecf4188df049d7a4726bb2a00) combines Spec-Driven Development, Test-Driven Development, and adversarial verification into a formal pipeline: crystallize the spec → write failing tests → implement → adversarial review (Sarcasmotron) → feedback to the right phase → formal hardening → convergence. The exit condition: the adversary is forced to invent problems that don't exist.

**Layer 5: Iterate the right layer - not just the output.** <br />
When the adversary finds a gap, it came from somewhere. A spec gap goes back to Layer 1. A test gap goes back to Layer 2. A playbook or role gap goes back to Layer 3. Fixing code without updating the layer that caused the mistake means you'll hit the same gap again, shaped differently.

The goal isn't a perfect prompt. It's a system that converges. VSDD's exit condition is concrete: you're done when the adversary is forced to invent problems that don't exist. That's what "good" actually looks like.

When this is working well, things look like this:

- Specs exist before prompts do.
- Tests fail before code does.
- A different model finds what the first one missed.
- Gaps go back to the right layer - spec, tests, or playbook.
- You stop when the adversary runs out of real problems to find.

## Your Repo Is the Prompt

Here's the part most people miss.

AI reads your codebase like a library of hints.
Every file name, every variable name, every half-finished comment, every test that says `// TODO: actually test this` is context. It all shapes what AI thinks you want.

If your repo is inconsistent, AI learns inconsistency.
If it's explicit and well-tested, AI gets better at helping you.

Not because of magic. Because you gave it better material to work with.

That means how you maintain your codebase is also, now, how you communicate with your AI tooling.

- The README is the spec.
- The tests are the definition of done.
- The lint rules are the standards.
- The branch names are the intent.
- The commit messages are the history.
- The pull requests are the decisions.
- The prompts folder is the playbook.

This used to be overhead. You named branches because they needed names. You wrote commit messages because convention said to. You filled in the PR description because someone would skim it before merging.

AI doesn't skim. It reads all of it and uses it to build a model of what you're trying to do.

"fix auth" is noise. "fix OAuth token refresh race on concurrent requests" is a precise signal - and precision affects every inference AI makes about code that touches auth. A well-named branch tells AI what work is in flight. A complete PR description tells it what was decided and what was explicitly left out of scope. Every layer compounds.

The gap between "good enough for your team" and "good enough for AI" is precision. Humans fill gaps with social context: who worked on this, what the hallway conversation was, what was obvious at the time. AI fills gaps with probability. Probability is not your intent.

There used to be a recovery channel. If a commit message was vague, you could ask. Slack, standups, the person next to you. AI has what's in the repo. That's it. The context that lived in your head or in a meeting now has to live in the artifacts.

Write them for someone brilliant who started today and only knows what's in the repo.

You're not writing documentation. You're writing the shared reality.

## It's an Open Book

Here's a property of AI that most people don't think to use: you can just ask.

AI is the first collaborator you've ever had that will tell you, directly and honestly, what context it loaded, what rules it thinks it's working under, and why it made a choice.

If something comes out wrong, you don't have to guess what happened. You can ask "what rules are you working with right now?" and it will tell you. You can ask "why did you choose that approach?" and it will explain. You can ask "what do you think the definition of done is here?" and it will show you its current understanding.

That's not something you can do with a human teammate. People have gaps in what they know, gaps in what they'll admit to, and a whole set of social reasons not to say "actually, I have no idea what the standard is here."

AI has none of that friction.

This makes the loop tight. You write the playbook. You give it to AI. You can then ask AI to read it back. If what comes back doesn't match what you wrote, the gap is real and now it's visible. You can fix it before it becomes a six-week problem.

Think of it less like delegating to a black box, and more like pair programming with someone who will always tell you exactly what they understood.

```mermaid
flowchart LR
  A["Write the playbook"] --> B["AI loads it and acts"]
  B --> C["Ask: what did you load?"]
  C --> D{Gap?}
  D -->|"yes, fix it"| A
  D -->|"no"| E["Good to go."]
```

That feedback loop is something you don't get with any other tool. Use it.

## The Thing Worth Actually Saying

The model isn't your bottleneck. Your spec is.

Not your prompt. Your spec. AI is powerful enough right now that the limiting factor in most workflows is whether you've actually defined what done means - formally enough to test it, adversarially enough to stress it, precisely enough for something to build against.

That's not a technical problem. It's a discipline problem.

Shared reality is how you fix it. A crystallized spec before you touch a prompt. Tests that fail before code exists. A Builder that builds and an Adversary that breaks it. Feedback that goes back to the layer that caused the gap. And an exit condition you can actually check.

AI can help you build anything. But it can't write your spec, design your tests, or find its own blind spots.

So be the Architect. Write the playbook. Let the Builder build and the Adversary break it. Stop when the Adversary runs out of real problems.
