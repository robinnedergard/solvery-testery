// export function solveGlassesProblem() {
//   console.log("Solving the glasses problem...");
// }

type GlassPosition = 0 | 1 | 2 | 3;

type Color =
  | "brown"
  | "dark_green"
  | "light_green"
  | "peach"
  | "red"
  | "purple"
  | "dark_blue"
  | "light_blue"
  | "yellow"
  | "gray"
  | "lime"
  | "pink";
type Glass = Record<GlassPosition, Color | null>;
type GlassSetup = Glass[];

// export const DefaultSetup: GlassSetup = [
//   ["brown", "dark_green", "peach", "red"],
//   ["yellow", "purple", "dark_blue", "purple"],
//   ["gray", "light_green", "gray", "light_blue"],
//   ["light_blue", "gray", "dark_blue", "red"],
//   ["purple", "light_green", "lime", "red"],
//   ["light_green", "light_blue", "lime", "red"],
//   ["peach", "yellow", "yellow", "red"],
//   // row 2
//   ["dark_green", "pink", "brown", "gray"],
//   ["pink", "pink", "light_blue", "purple"],
//   ["brown", "brown", "purple", "purple"],
//   ["yellow", "lime", "lime", "dark_green"],
//   ["pink", "dark_green", "lime", "light_green"],
//   [null, null, null, null],
//   [null, null, null, null],
// ];

export const DefaultSetup: GlassSetup = [
  ["brown", "brown", "peach", "peach"],
  [null, null, null, null],
  ["brown", "brown", "peach", "peach"],
  [null, null, null, null],
];

function solveGlassesProblem(setup: GlassSetup = DefaultSetup) {
  // let setup: GlassSetup = JSON.parse(JSON.stringify(DefaultSetup));
  const moves: {
    from: { glass: number; position: GlassPosition };
    to: { glass: number; position: GlassPosition };
    color: Color;
  }[] = [];

  function findTopIndex(glass: Glass): GlassPosition | null {
    for (const i of [0, 1, 2, 3] as const) {
      if (glass[i] !== null) return i;
    }
    return null;
  }

  function findPossibleMove(
    glass: Glass,
    colorToMatch: Color,
  ): GlassPosition | null {
    for (const i of [3, 2, 1, 0] as const) {
      if (glass[i] && glass[i] !== colorToMatch) {
        return null;
      }
      if (glass[i] === null) {
        return i;
      }
    }
    return null;
  }

  let moved = true;
  let iteration = 0;
  while (moved && iteration < 20) {
    moved = false;
    const glassOrder = prioritizeGlasses(setup);
    console.log(
      "Glass order:",
      glassOrder.map((g) => ({
        index: g.index,
        score: g.score,
        glass: setup[g.index],
      })),
    );
    for (const from of glassOrder) {
      const fromGlass = setup[from.index];

      if (!fromGlass) continue;

      const topIdx = findTopIndex(fromGlass);

      if (topIdx === null) continue;

      const color = fromGlass[topIdx];
      if (color === null) continue;

      for (let to = 0; to < setup.length; to++) {
        iteration++;
        if (from.index === to) continue;
        const toGlass = setup[to];
        if (!toGlass) continue;
        const emptyIdx = findPossibleMove(toGlass, color);
        if (emptyIdx === null) continue;
        // Move color
        toGlass[emptyIdx] = color;
        fromGlass[topIdx] = null;
        moves.push({
          from: { glass: from.index, position: topIdx },
          to: { glass: to, position: emptyIdx },
          color,
        });
        moved = true;
        break;
      }
      if (moved) break;
    }
  }

  console.log("Moves:", moves);
  console.log("Final setup:", setup);
}

function prioritizeGlasses(setup: GlassSetup) {
  const glassScores = setup.map((glass, index) => {
    if (!glass) return { index, score: -1 };
    const colorCount: Record<Color, number> = {} as Record<Color, number>;
    let emptyCount = 0;
    for (const color of [glass[0], glass[1], glass[2], glass[3]]) {
      if (color === null) {
        emptyCount++;
      } else {
        colorCount[color] = (colorCount[color] || 0) + 1;
      }
    }
    const maxColorCount = Math.max(...Object.values(colorCount), 0);
    const score = maxColorCount * 10 + emptyCount;
    return { index, score };
  });
  return glassScores.sort((a, b) => b.score - a.score);
}

solveGlassesProblem();
