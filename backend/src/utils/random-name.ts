const adjectives = ["brisk", "quiet", "amber", "steady", "silver", "curious", "rapid", "cobalt"];
const nouns = ["otter", "falcon", "byte", "comet", "fox", "panda", "lynx", "sparrow"];

export function generateDisplayName() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const suffix = Math.floor(Math.random() * 900 + 100);

  return `${adjective}-${noun}-${suffix}`;
}
