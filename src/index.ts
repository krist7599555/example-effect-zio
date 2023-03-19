import fetch from "node-fetch";
import { Matcher } from "@effect/match";
import { pipe, constant, identity } from "@effect-app/core/Function";
import * as Effect from "@effect/io/Effect";
import * as Option from "@effect/data/Option";
import * as Either from "@effect/data/Either";

const x = Effect.succeed(13);
const a = Option.some(3)
  .map((a) => `Hello ${a}`)
  .toEither(() => "x");
// Effect.fromOption

const f = Effect.gen(function* ($) {
  //
  yield $(Effect.succeed(1));
  yield $(Effect.succeed(2));
  yield $(Effect.succeed(3));
  return "OK" as const;
});
const mmm = Effect.fail(9);
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

const apis = Effect.runPromise(
  pipe(
    Effect.collectAllPar([
      countApi("get", "30secsbeforedeath.deadlinealwaysexists.com", "visits"),
      countApi("get", "safeabortion.insidethesandbox.studio", "visits"),
      countApi("get", "asia7-oneirophobia.com", "visits"),
      countApi("get", "grabavatarth.com", "visits"),
      countApi("get", "msgfromtomorrow.com", "visits"),
    ]),
    Effect.map((o) => Array.from(o))
  )
);

apis.then(console.log);

const ax = Either.right(1);
