# Sample prompts

## Should BLOCK (high ambiguity)

```text
fix it
```

```text
improve the auth
```

```text
clean this up and also make it faster
```

```text
handle the payment stuff in production
```

## Should PASS (clear enough)

```text
In src/auth/session.ts, fix refresh token rotation. Keep the diff minimal. Unit tests in src/auth/session.test.ts must pass.
```

```text
[clarity:1b,2b,3a] rename getUser to fetchUser in packages/api/src/users.ts only
```

```text
[clarity:skip] just explore the repo structure
```

## Follow-ups that should PASS

```text
yes
```

```text
continue
```

```text
lgtm
```
