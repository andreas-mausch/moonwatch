import suncalc from 'suncalc'

export default (date: Date): string => {
  const positions = [
    "-1110px -1840px",
    "-405px -50px",
    "-760px -50px",
    "-1120px -50px",
    "-35px -410px",
    "-390px -410px",
    "-750px -410px",
    "-1110px -410px",
    "-35px -770px",
    "-390px -770px",
    "-750px -770px",
    "-35px -1125px",
    "-390px -1125px",
    "-750px -1125px",
    "-1110px -1125px",
    "-35px -1480px",
    "-390px -1480px",
    "-750px -1480px",
    "-1110px -1480px",
    "-35px -1840px",
    "-390px -1840px",
    "-750px -1840px"
  ];

  const illumination = suncalc.getMoonIllumination(date);
  let index = Math.round(positions.length * illumination.phase)
  if (index >= positions.length) {
    index = 0
  }

  return positions[index];
}
