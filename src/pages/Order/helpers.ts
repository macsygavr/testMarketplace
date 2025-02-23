export const generateOrderNumber = () => {
  const part1 = Math.floor(Math.random() * 900) + 100;
  const part2 = Math.floor(Math.random() * 900) + 100;
  return `${part1}-${part2}`;
};
