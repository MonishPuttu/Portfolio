/**
 * Exhaustive check of the nav section rule.
 *
 * Sweeps every scroll position, at three real viewports, asserting the whole
 * shape of the behaviour rather than sampling a few points: the top is Work,
 * the bottom is Contact, and About owns only the band its own tile occupies.
 *
 * Work deliberately appears twice in a downward pass. About is the experience
 * tile, which sits beside the featured project on desktop and above it on
 * narrower screens, so the projects run *follows* About in both layouts. The
 * pill returning to Work there is the fix, not a regression â the old rule
 * never let go of About and mislabelled that whole stretch of the page.
 *
 *   node src/components/bento/sectionSpy.test.mjs
 *
 * Geometry below was measured from the running page, not invented.
 */
import assert from "node:assert/strict";
import { ACTIVE_MARKER, sectionAt } from "./sectionSpy.js";

const LAYOUTS = [
  {
    name: "desktop 1440x900",
    viewportHeight: 900,
    docHeight: 2242,
    anchors: [
      { id: "about", top: 417, height: 666 },
      { id: "contact", top: 1941, height: 234 },
    ],
  },
  {
    name: "tablet 820x900",
    viewportHeight: 900,
    docHeight: 3336,
    anchors: [
      { id: "about", top: 531, height: 568 },
      { id: "contact", top: 2844, height: 425 },
    ],
  },
  {
    name: "mobile 390x844",
    viewportHeight: 844,
    docHeight: 4688,
    anchors: [
      { id: "about", top: 732, height: 722 },
      { id: "contact", top: 4121, height: 500 },
    ],
  },
];

const ORDER = ["work", "about", "contact"];
let checks = 0;

for (const layout of LAYOUTS) {
  const maxScroll = layout.docHeight - layout.viewportHeight;
  const at = (y) => sectionAt(y, layout);

  // 1. Every pixel resolves to a known section.
  const seen = [];
  for (let y = 0; y <= maxScroll; y += 1) {
    const s = at(y);
    assert.ok(ORDER.includes(s), `${layout.name}: y=${y} gave "${s}"`);
    if (seen[seen.length - 1] !== s) seen.push(s);
    checks++;
  }

  // 2. The page starts on Work and ends on Contact.
  assert.equal(at(0), "work", `${layout.name}: top should be Work`);
  assert.equal(
    at(maxScroll),
    "contact",
    `${layout.name}: bottom should be Contact`,
  );

  // 3. Scrolling down visits Work, then About, then Work again for the run of
  //    project tiles below the experience tile, then Contact. The old rule
  //    produced work -> about -> contact, with About covering every project.
  assert.deepEqual(
    seen,
    ["work", "about", "work", "contact"],
    `${layout.name}: unexpected sequence ${seen.join(" -> ")}`,
  );

  // 4. Scrolling back up is the exact mirror. The reported bug was the pill
  //    sticking on About all the way to the top; the mirror is what rules that
  //    out in both directions.
  const upward = [];
  for (let y = maxScroll; y >= 0; y -= 1) {
    const s = at(y);
    if (upward[upward.length - 1] !== s) upward.push(s);
  }
  assert.deepEqual(
    upward,
    [...seen].reverse(),
    `${layout.name}: upward sequence was ${upward.join(" -> ")}`,
  );

  // 5. Every boundary is a single clean switch, with no oscillation around it.
  const boundaries = [];
  for (let y = 1; y <= maxScroll; y += 1) {
    if (at(y) !== at(y - 1)) boundaries.push(y);
  }
  assert.equal(
    boundaries.length,
    3,
    `${layout.name}: expected 3 transitions, saw ${boundaries.length}`,
  );

  // 5b. About is bounded by its own tile: it must never still be current once
  //     the marker has cleared the bottom of the experience tile. This is the
  //     regression that mislabelled the projects, stated directly.
  const about = layout.anchors.find((a) => a.id === "about");
  for (let y = 0; y <= maxScroll; y += 1) {
    const marker = y + ACTIVE_MARKER;
    if (marker >= about.top && marker < about.top + about.height) continue;
    assert.notEqual(
      at(y),
      "about",
      `${layout.name}: About still current at y=${y}, outside its own tile`,
    );
    checks++;
  }

  // 6. Clicking a nav item must land somewhere the rule agrees is that
  //    section — otherwise the indicator corrects itself the moment the
  //    scroll settles, which is what "clicking Contact reverts to About" was.
  const HEADER_OFFSET = 86;
  layout.anchors.forEach(({ id, top }) => {
    const landing = Math.min(Math.max(0, top - HEADER_OFFSET), maxScroll);
    assert.equal(
      at(landing),
      id,
      `${layout.name}: clicking ${id} lands at ${landing}, which reads as "${at(landing)}"`,
    );
    checks++;
  });
  assert.equal(at(0), "work", `${layout.name}: clicking Work lands on Work`);

  // 7. And it must still read the same a moment later, once anything that
  //    settles late has settled — the landing cannot sit on a boundary.
  layout.anchors.forEach(({ id, top }) => {
    const landing = Math.min(Math.max(0, top - HEADER_OFFSET), maxScroll);
    for (let drift = -3; drift <= 3; drift += 1) {
      const y = Math.min(Math.max(0, landing + drift), maxScroll);
      assert.equal(
        at(y),
        id,
        `${layout.name}: ${id} landing is unstable at ${drift > 0 ? "+" : ""}${drift}px`,
      );
      checks++;
    }
  });

  console.log(
    `${layout.name.padEnd(18)} 0-${maxScroll}px  ` +
      `work→about @${boundaries[0]}  ` +
      `about→work @${boundaries[1]}  ` +
      `work→contact @${boundaries[2]}`,
  );
}

// 6. Degenerate inputs must not throw or invent a section.
assert.equal(sectionAt(0, undefined), "work");
assert.equal(sectionAt(0, { viewportHeight: 900, docHeight: 900, anchors: [] }), "work");
assert.equal(sectionAt(-50, LAYOUTS[0]), "work", "negative scroll (rubber-band)");
assert.equal(
  sectionAt(99999, LAYOUTS[0]),
  "contact",
  "over-scroll past the end",
);

// 7. A section taller than the viewport can still become current: the ratio
//    rule alone could never fire for it.
const tall = {
  viewportHeight: 600,
  docHeight: 6000,
  anchors: [
    { id: "about", top: 400, height: 300 },
    { id: "contact", top: 1000, height: 4000 },
  ],
};
assert.equal(sectionAt(0, tall), "work");
assert.equal(sectionAt(3000, tall), "contact", "tall final section");

console.log(`\nAll assertions passed (${checks} scroll positions swept).`);
