import fetch from "node-fetch";
import { Matcher } from "@effect/match";
import { pipe, constant, identity } from "@effect-app/core/Function";
import * as Effect from "@effect/io/Effect";
import * as Option from "@effect/data/Option";
import * as Either from "@effect/data/Either";

const x = Effect.succeed(13)
  .map(identity)
  .map((a) => a * 13)
  .map((a) => a.toLocaleString());

const a = Option.some(3)
  .map((a) => `Hello ${a}`)
  .toEither(() => "x");

const f = Effect.gen(function* ($) {
  yield $(Effect.succeed(1));
  yield $(Effect.succeed(2));
  yield $(Effect.succeed(3));
  return "OK" as const;
});

const countApi = (command: "hit" | "get", namespace: string, key: string) =>
  Effect.promise(() =>
    fetch(`https://api.countapi.xyz/${command}/${namespace}/${key}`, {
      headers: { accept: "application/json" },
    })
  )
    .flatMap((res) => Effect.promise<any>(() => res.json()))
    .map(
      Matcher.type<{ value: number | null }>()
        .when({ value: Matcher.number }, identity)
        .when({ value: null }, constant({ value: 0 })).exhaustive
    );

const apis = Effect.collectAllPar([
  countApi("get", "30secsbeforedeath.deadlinealwaysexists.com", "visits"),
  countApi("get", "safeabortion.insidethesandbox.studio", "visits"),
  countApi("get", "asia7-oneirophobia.com", "visits"),
  countApi("get", "grabavatarth.com", "visits"),
  countApi("get", "msgfromtomorrow.com", "visits"),
])
  .map((o) => Array.from(o))
  .either.runPromise.then(console.log);
