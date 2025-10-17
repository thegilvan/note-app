export const getInitials = (name) => {
  if (!name) return "";

  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};
console.log("Gilvan Silva".split(" "));
console.log(Math.min("Gilvan Silva".split(" ").length, 2));
console.log(getInitials("Gilvan Silva"));
