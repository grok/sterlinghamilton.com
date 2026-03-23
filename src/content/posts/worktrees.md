---
title: The Git Feature Nobody Cared About (Until AI Did)
pubDate: "2026-03-22"
lang: en
translationKey: worktrees
---

**Git worktrees** have existed since 2015. They sat quietly in the documentation, largely ignored, occasionally discovered by a curious engineer who mentioned them once in a Slack thread (I guess some people were doing Skype still... RIP) and then never again.

Most developers just stashed, committed WIP, or cloned the repo twice - good enough for the typical "one thing at a time" workflow. The mental model is a bit awkward, short-lived feature branches meant you rarely needed two active checkouts at once, and IDEs didn't make it easy anyway. So nobody bothered.

Then AI agents showed up. Now all of the sudden, everyone wants to buy _worktrees_ a drink. They wanna know all about their new friend **AI** -- they are kind of cute.

You don't have to become a historian to use AI tools well.

But if you're going to be a professional racecar driver, it doesn't hurt to know what the engine is doing.

Because right now, your AI is doing something under the hood - and if it stops mid-task, **you'll want to know where to look.**

Try to understand the magic spells you are casting for when things go wrong.

## A Time Machine

Here's all the git background you actually need.

Git is a **time machine**.

Every time you commit, git takes a snapshot of your work - a frozen moment it can go back to.<br />
You've probably seen the little circles in a diagram somewhere.<br />Each one is a commit. Each one is a moment.

Normally, everyone works on one timeline. **The main branch.** You add stuff, commit it, it joins the line.

But here's where it gets interesting.

If you know anything about me, I am a yappin, analogy lovin, nerd.<br />
So buckle up.

You're **Dr. Strange**.<br />
Worktrees are a way for you to create new **universes**.
New **timelines**.

You start from a point in the **main timeline**, branch off, and now you've got a parallel one.<br />
You can work there without touching the original.<br />
When you're ready, you bring the timelines together.

That's a **branch**. Anyone who has used git, knows and loves branches, but what's the diference between a _branch_ and a _worktree_?

## Something Different

A branch is a timeline. **A worktree is being in two timelines at the same time.**

Normally when you switch branches, you clear your desk.<br />
You stash your current work, check out the other branch, do the thing, come back, unstash. _One desk. One thing at a time._

A worktree gives you **two desks in two rooms**.<br />
Whatever is on desk A stays there while you work on desk B.<br />
You don't pack anything away.<br />
You just walk into the other room.

Technically: a worktree is a **separate directory** on your filesystem, linked to the same git repository, checked out to its own branch.<br />
Changes in one worktree don't touch the others.<br />
They share the git history but have **completely separate working directories.**

_One repo. Multiple live checkouts. No stepping on each other._

## This Is Why AI Can Do Two Things at Once

When you ask Claude Code (or similar tools) to work on multiple tasks in parallel, it doesn't just open two chat windows and hope for the best.<br />
It **spins up a worktree for each task.** Each one gets its own directory, its own branch, its own isolated workspace.

**Agent A** is heads-down on the refactor.<br />
**Agent B** is fixing the bug.<br />
**Neither knows the other exists.** Neither has to wait. Neither can accidentally overwrite the other's work.

Two separate rooms, two desks, two timelines - all from the same repo, all at the same time.

## A Trap

Here's where people get lost.

The AI is working in a worktree.
That worktree is a completely separate directory on your computer - **not where you normally work.**

So when you open a terminal and run `git status` in your usual project folder, you see nothing. No changes. No files. _Nothing._

**The work isn't missing. It's just in another room.**

This matters especially if the AI stops mid-task or you want to check its progress.<br />
If you don't know about worktrees, you're standing in the kitchen wondering where your wallet is.

_It's in the office. You just don't know there's an office._

The command that turns the lights on is this:

```bash
git worktree list
```

This shows you every active worktree - where it lives on your filesystem and which branch it's on.<br />
Once you know the path, you can `cd` into it and run `git status` there. **You'll see exactly what the AI was working on.**

## Three Things to Know

You don't need to memorize git internals. You need these three.

**See what worktrees exist:**

```bash
git worktree list
```

**Create a new one** (a new directory + new branch, in one go):

```bash
git worktree add ../my-feature-branch my-feature-branch
```

**Clean one up when you're done:**

```bash
git worktree remove ../my-feature-branch
```

That's it. The rest is just git as you already know it - commits, branches, merges. The worktree is just **where the work happens.**

One thing worth knowing: **worktrees don't clean themselves up.**<br />
If you spin up five of them and forget about them, they stick around. A quick `git worktree list` every so often keeps you from accumulating _ghost rooms._

The AI may do that for you. But if it doesn't you're gonna have some litter.

## Not Required Reading

Most people who use AI coding tools aren't going to create worktrees themselves every day. _That's fine. The tools handle it._

Hell, the underlying methodology or even the use of git may change **ENTIRELY** in a few weeks.

But the next time your AI says it's working on two things at once, or you can't find where the changes went, or `git status` shows nothing and **panik** - now you know what's happening.

There's another room. The work is in it. `git worktree list` will tell you where.

_That's the whole engine. You can go back to driving now._
