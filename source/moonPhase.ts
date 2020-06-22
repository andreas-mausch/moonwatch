import suncalc from 'suncalc'

export default (date: Date): string => {
  const positions = [
    "-1110px -1840px",
    "-390px -50px",
    "-748px -50px",
    "-1105px -50px",
    "-35px -408px",
    "-390px -408px",
    "-750px -408px",
    "-1105px -408px",
    "-35px -767px",
    "-393px -767px",
    "-750px -767px",
    "-33px -1124px",
    "-390px -1124px",
    "-750px -1125px",
    "-1108px -1124px",
    "-35px -1482px",
    "-390px -1482px",
    "-750px -1482px",
    "-1112px -1482px",
    "-40px -1838px",
    "-398px -1838px",
    "-755px -1838px"
  ];

  const illumination = suncalc.getMoonIllumination(date);
  let index = Math.round(positions.length * illumination.phase)
  if (index >= positions.length) {
    index = 0
  }

  return positions[index];
}
