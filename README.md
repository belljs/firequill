# Firequill

A lightweight, privacy-first, syntax-highlighted plain-text editor that runs entirely in your browser. No accounts. No databases. No backend. Your notes are stored **locally only** using `localStorage`.

Firequill uses a **custom plaintext note-taking syntax** designed for speed, structure, and clarity. The syntax is intentionally simple enough to enable fast recording of notes, meetings, tasks, or daily journaling—while still being structured enough for software to understand.

Firequill is the first tool in a growing ecosystem of **open-source utilities** that will:

- parse your notes automatically
- extract tasks, meetings, and metadata
- generate meeting summaries  
- organize projects and tags  
- convert notes into structured data for other apps or storage/record keeping.

The long-term vision is a suite of lightweight tools that work together to turn everyday plaintext notes into actionable, searchable, connected information—without ever locking you into a proprietary format or requiring a backend.

## Syntax

- **Live syntax highlighting** using plain-text markers:
  - `#` — headings  
  - `[ ]` — open tasks  
  - `[X]` — completed tasks  
  - `!` — important  
  - `::` — metadata  
  - `*` — bullets  
  - `%%%` — blocks  

## Privacy

- Data is stored using the key: firequill-notes-v1
- Clearing browser storage will erase your notes
- Notes do not sync across devices (by design)