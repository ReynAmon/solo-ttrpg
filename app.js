function rollDie(sides = 6) {
  return Math.floor(Math.random() * sides) + 1;
}

document.getElementById("roll").onclick = () => {
  const result = rollDie();
  document.getElementById("output").textContent =
    "You rolled: " + result;
};