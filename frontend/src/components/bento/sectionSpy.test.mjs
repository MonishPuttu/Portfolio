/**
 * Exhaustive check of the nav section rule.
 *
 * Sweeps every scroll position, at three real viewports, asserting the whole
 * shape of the behaviour rather than sampling a few points: the top is Work,
 * the bottom is Contact, and the sequence never goes backwards or skips.
 *
 *   node src/components/bento/sectionSpy.test.mjs
 *
 * Geometry below was measured from the running page, not invented.
 */
import assert from "node:assert/strict";
import { sectionAt } from "./sectionSpy.js";

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

  // 3. Scrolling down passes through each section once, in order, never
  //    revisiting one it already left. This is what "stuck on About" and the
  //    flicker between About and Contact would both violate.
  assert.deepEqual(
    seen,
    ["work", "about", "contact"],
    `${layout.name}: unexpected sequence ${seen.join(" -> ")}`,
  );

  // 4. Scrolling back up is the exact mirror — the reported bug was the pill
  //    sticking on About all the way to the top.
  const upward = [];
  for (let y = maxScroll; y >= 0; y -= 1) {
    const s = at(y);
    if (upward[upward.length - 1] !== s) upward.push(s);
  }
  assert.deepEqual(
    upward,
    ["contact", "about", "work"],
    `${layout.name}: upward sequence was ${upward.join(" -> ")}`,
  );

  // 5. Every boundary is a single clean switch, with no oscillation around it.
  const boundaries = [];
  for (let y = 1; y <= maxScroll; y += 1) {
    if (at(y) !== at(y - 1)) boundaries.push(y);
  }
  assert.equal(
    boundaries.length,
    2,
    `${layout.name}: expected 2 transitions, saw ${boundaries.length}`,
  );

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
    `${layout.name.padEnd(18)} 0-${maxScroll}px  work→about @${boundaries[0]}  about→contact @${boundaries[1]}`,
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
