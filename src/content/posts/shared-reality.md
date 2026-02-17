---
title: Shared Reality with AI
pubDate: "2026-02-16"
lang: en
translationKey: shared-reality-with-ai
---

## TL;DR

This article is about saying what you mean - to other people, and especially to AI. Humans can waffle about with ambiguity via context and social glue.<br /> AI cannot.

If you want it to be a good partner, you have to build shared reality on purpose: define the words, define "done", and put guardrails in place so you can actually verify what you got back.

## On Reality

> **Reality** is the state of everything that exists, not how they might be imagined. <br />
> - <cite>Wikipedia[^1]</cite>

[^1]: [Reality](https://en.wikipedia.org/wiki/Reality) article on Wikipedia.

Humans, take reality for granted.<br />
Shared reality is just an abstract way to talk about how we all operate in the same world.

It's an assumption. Of course that person sitting over there sees the same Purple.<br />
Obviously we are in the same year. Gravity still works the same for everyone.

What happens when reality _isn't_ the same?

Everyday, we both point at the same thing and say, "yes, _that_". We agree on the details. We might waffle about philisophical ideas or moralities, but at the end of the day, everyone is on the same page about what a coconut is.

The shared set of assumptions underneath the conversation.<br />
The invisible rules, definitions, and expectations that make words mean the same thing to both beings.

If we do not agree on what is real, then we are just taking turns making noises. 😵‍💫

### Consensual vs. Consensus

These two words look like twins. They are not.

> **Consensus reality** is related to, but distinct from, **consensual reality**. The difference between these terms is that whereas consensus reality describes a state of mutual agreement about what is true (consensus is a noun), consensual reality describes a type of agreement about what is true (consensual is an adjective). In other words, reality may also be non-consensual, as when one person's preferred version of reality conflicts with another person's preferred version of reality. <br />
> - <cite>Wikipedia[^2]</cite>

[^2]: [Consensus Reality](https://en.wikipedia.org/wiki/Consensus_reality) article on Wikipedia.

Consensus vs. consensual is basically **outcome** vs. **process**.

Consensus reality is what a group ends up treating as true. The shared "we all agree this is the deal" layer. It might come from careful alignment, or it might come from inertia and one loud person winning the meeting. Either way, it's the end state.

Consensual reality is how you got there: people actually opted in. You named the rules, defined the words, and everyone agreed to play the same game.

The "shared reality" we're talking about is closest to consensual reality - because we want the agreement to be intentional, not accidental. But the practical goal is still consensus: a shared map you can rely on when it matters.

- What the words mean.
- What we are trying to do.
- What "good" and "bad" appear to be.
- What the rules are.

Here are a few small examples:

- If I say "meet me at 5", do I mean 5:00 on the dot, or "sometime around 5-ish"?
- If I say "let's ship it", do I mean "merge it", "deploy it", or "tell the customer it's done"?
- If I say "this is urgent", do I mean "drop everything", or "do it today after lunch"?

If that sounds obvious... yeah. It CAN be. <br />
Or depending on where you live, your culture, your background... "around 5-ish" will mean something VERY different to you.

It is still the #1 thing we skip when we are tired, rushing, or feeling clever/lazy. <br />
It's also the thing that commonly creates us the most work and wasted time.

## Analogy Time

If you are on a sports team, you can not run "a play".

You run _the_ play.

Same rules. Same terms. Same expectations. <br />
If the coach says "run 42", and you run "the version of 42 you invented in your head", that's not creativity.

That is just a polite way to lose.

Relationships are the same. Work is the same. Even friendships have a playbook. <br />
We just pretend they don't because writing it down feels cringe.

## Cool story B2B bro, where's the AI?

It's all around you my dude.

I thought about linking to a ton of articles. Some supporting my thoughts here, some going in a completely different direction. But I've decided that I'm just some guy who has found success in a set of methodologies and there are other peeps who have also found success.

In general, a lot of the themes of discussion look like...

- Completely change the way you are thinking and if you are opening up a terminal or an editor you've already failed.
- AI is a partner. Treat it as an engineer.
- AI is an existential crisis. The end is nigh, rejoice.
- Always trust AI. It knows more than you do. If the AI wrote it, it must be correct. The machine has spoken.
- Never trust AI. It's constantly on drugs and is going to cause you endless problems. Any AI code is a time bomb with a cute autocomplete UI.

... and so on.

Some are publishing nuanced articles about how documentation no longer matters.<br />
Some are saying that requirements are all that matters.

I do not think **anyone** has proven a universal winning model yet.<br />
If they had, they would be _extremely_ wealthy.

We are all running the same race. We are just wearing different shoes.

So... I am not here to sell you a perfect process.

I am here to argue for something more basic: <br />
If you want AI to be a useful partner, you need a shared reality with it.

Imagine you are hiring 500 new engineers.<br />
Not senior engineers. Not people who "already know how we do things".<br />
More like a swarm of smart interns who can move fast, but will confidently do the wrong thing if you are vague.

If you knew that onboarding wave was coming, you would not rely on vibes.<br />
You would lay groundwork:

- definitions (what does "ship" mean here)
- standards (naming, commit messages, "definition of done")
- guardrails (linting, tests, CI checks)
- a way to prove work is good (not just "it looks right")

That is not bureaucracy. That is compassion for Future You.

AI is similar, except you can onboard 500 "interns" in an afternoon.<br />
So the cost of missing groundwork shows up faster.

This is going to apply to designing things, writing content, making financial trades.<br/>
I'm a software engineer by trade, but the application of a shared reality is not only applicable to writing code.

## What's Good? What's Bad?

Setting aside existential and moral debates for another time - because those are important too.

### The Bad

Consequences of not having a shared reality:

- Some agent written code can pass tests and still be insecure or not working as intended.
- Often an agent will say "mission complete" and you'll go look at it... and it's very much no bueno. The more "agentic" your workflow is, the more you need explicit success checks and constraints, not just a prompt.
- AI makes stuff up, it does insane things. More often because of a skewed reality.
- It will try to run commands with the wrong environment variables, or inside a sandbox when it shouldn't.
- It'll create artifacts (in this context, an "artifact" is any output the AI produces for you, like a file, a report, or an updated line of code) that just pollute your workspace and don't get used.
- You'll think you're building layers of prompting instructions but really it's a blank slate every conversation.

The worst of all of this, in my opinion, is you will know what needs to be done... but you won't know what a good solution looks like.

You'll end up with something and go "I guess this works" and it may, in fact, be the absolute worst way you could have implemented that.

We are not ready to hand over the steering wheel to AI.<br />
Not because of AI's deficiencies.<br />
Because of ours.

Humans are inconsistent. We forget. We hand-wave. Change our minds.

AI can help, but it can not fix a missing objective. <br />
It can not guess your standards reliably. <br />
It can not read your mind (yet, thankfully).

So, it's a partnership right now, because in my opinion, the other options are not viable yet.

To be a good partner, you need clear communication.<br />
And clear communication needs shared reality.

### The Good

With the right setup you can achieve the following good things:

- When you want to fix a problem, it will confirm the problem even exists before offering a solution.
- Solutions provided are tested using Unit Tests, E2E Tests, API Calls, inspecting payloads, etc.
- When you ask it to do something bad, it will actually push back and go "hey, that's a bad idea".
- You won't have to repeat yourself or argue as much as you currently are doing right now.

The most important thing will be that if it DOES (and it will) make mistakes, you can follow along and figure out where in the **process** did it fall apart?<br />
You can then itterate and over time end up with something special and highly productive.

## How?

This article isn't going to go into super nuanced, highly detailed implementation strategies.<br />
We're going to stay high level so I can later write those ideas into their own articles.

Off the top of my head, what has worked extremely well:

- Mixing of deterministic and non-deterministic tools. AI that uses/builds repeatable scripts, things like that.
- Thorough documentation. The argument that documentation gets stale is a side-effect of humans being in charge of that documentation. Which is no longer the case. Documentation is a partnership now.
- Consistency. Formatting. Commit messages. PR descriptions. Testing. Tickets. Specs. Designs. All of this can be done with an AI partnership. All of this feeds back into a positive loop. For both the humans and the machines.
- Articulate your goal. Simply. Quickly. If you cannot say the goal in one sentence, you do not understand the goal yet.
- Define what "done" means. Tests. Snapshots. End to End. Linting.
- Make standards real (and cheap).
- Understanding AI bootstrapping and layered prompting.
- Making full use of `git subtree`.
- Give the agent your playbook. Styleguides, naming conventions, holistic pictures of how it works with other repositories and technologies.

In the AI era, all of these things mentioned above add up faster, because the AI reads your repo like a library of hints.<br />
If your repo is half-finished thoughts and mystery meat decisions, the AI learns that too.

If your repo is consistent, tested, and explicit, the AI gets better at helping you.

Its all context now.

You are not writing bureaucracy.<br />
You are writing the shared reality.

## In Closing

AI is powerful, but it's not a mind reader.

Humans keep shared reality alive with context, tone, and eyebrow raises. We can hear "you know what I meant" and fill in the gaps.<br />
AI does not do that.<br />
It does exactly what you said - and then it does it again, at scale, in 0.8 seconds.

So if this whole article felt like "please be more specific", yes. That's the point.

The practical upside is not just speed.<br />
It's that AI forces you to be clear.

When you're clear, you can verify the work, spot misunderstandings earlier, and improve the system instead of arguing about what someone "probably meant".

That is shared reality: fewer surprises, less rework, and more trust that what got built matches what you asked for.
