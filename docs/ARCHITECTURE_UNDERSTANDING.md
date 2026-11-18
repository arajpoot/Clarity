# Companion ship architecture (R6)
**Bismillah.**

```
[ Port / ]
    │
    ├─ Companion /companion/     ← isolated room
    │     shell index.html (JS layers 20261117P38)
    │        → mounts body from companion/tabs/*
    │        → fragment backup companion/content/*
    │     does NOT own vault
    │     does NOT own Yawm SoT
    │     links to Craft ateliers
    │
    ├─ Yawm /daily/              ← isolated SoT
    ├─ Campus /campus/           ← frozen unless ticket
    ├─ Amānah /amana/            ← desk light
    │     /amana/unlock/         ← vault only here
    └─ Craft /craft/             ← ateliers
```

Ship rule: **body in, shell held, other rooms untouched.**
