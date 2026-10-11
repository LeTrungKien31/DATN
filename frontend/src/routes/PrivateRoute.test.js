import assert from "node:assert/strict";
import test from "node:test";

import { getPrivateRouteState } from "./privateRouteState.js";

test("getPrivateRouteState waits for authentication initialization", () => {
  assert.equal(
    getPrivateRouteState({ isInitializing: true, isAuthenticated: false }),
    "loading",
  );
});

test("getPrivateRouteState redirects unauthenticated visitors", () => {
  assert.equal(
    getPrivateRouteState({ isInitializing: false, isAuthenticated: false }),
    "redirect",
  );
});

test("getPrivateRouteState renders content for authenticated visitors", () => {
  assert.equal(
    getPrivateRouteState({ isInitializing: false, isAuthenticated: true }),
    "render",
  );
});
