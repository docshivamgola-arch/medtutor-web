export interface CardState {
  ef: number;
  interval: number;
  reps: number;
  dueAt: string;
}

export type Quality = 0 | 1 | 2 | 3 | 4 | 5;

export function sm2(state: CardState, quality: Quality): CardState {
  const { ef, interval, reps } = state;

  // Any quality < 3 resets the card (wrong / barely remembered)
  if (quality < 3) {
    return {
      ef,
      interval: 1,
      reps: 0,
      dueAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // retry in 10 min
    };
  }

  const newEf = Math.max(
    1.3,
    ef + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  );

  let newInterval: number;
  if (reps === 0) newInterval = 1;
  else if (reps === 1) newInterval = 6;
  else newInterval = Math.round(interval * newEf);

  return {
    ef: newEf,
    interval: newInterval,
    reps: reps + 1,
    dueAt: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000).toISOString(),
  };
}

export function defaultCardState(): CardState {
  return {
    ef: 2.5,
    interval: 1,
    reps: 0,
    dueAt: new Date().toISOString(),
  };
}

export function isDue(card: CardState): boolean {
  return new Date(card.dueAt) <= new Date();
}
