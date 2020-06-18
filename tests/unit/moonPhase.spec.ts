import moonPhase from "../../source/moonPhase";

describe('moonPhase', () => {
  it('should return correct coordinates for full moon', () => {
    expect(moonPhase(new Date('2020-06-05T19:12:00Z'))).toBe('-35px -1125px')
  });

  it('should return correct coordinates for new moon', () => {
    expect(moonPhase(new Date('2020-06-21T06:41:00Z'))).toBe('-1110px -1840px')
  });

  it('should return correct coordinates for first quarter', () => {
    expect(moonPhase(new Date('2020-06-28T08:15:00Z'))).toBe('-750px -410px')
  });
});
