import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@codeshare/shared";

const templates: Record<SupportedLanguage, string> = {
  plaintext: ``,
  typescript: `function greet(name: string) {\n  return \`Hello, \${name}\`;\n}\n\nconsole.log(greet("Codeshare"));\n`,
  javascript: `function greet(name) {\n  return \`Hello, \${name}\`;\n}\n\nconsole.log(greet("Codeshare"));\n`,
  python: `def greet(name: str) -> str:\n    return f"Hello, {name}"\n\nprint(greet("Codeshare"))\n`,
  java: `class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Codeshare");\n  }\n}\n`,
  cpp: `#include <iostream>\n\nint main() {\n  std::cout << "Hello, Codeshare" << std::endl;\n  return 0;\n}\n`,
  go: `package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello, Codeshare")\n}\n`,
  rust: `fn main() {\n    println!("Hello, Codeshare");\n}\n`,
  json: `{\n  "message": "Hello, Codeshare"\n}\n`,
  markdown: `# Welcome\n\nShare code instantly without signups.\n`,
  html: `<!doctype html>\n<html>\n  <head>\n    <title>Codeshare Room</title>\n  </head>\n  <body>\n    <h1>Hello, Codeshare</h1>\n  </body>\n</html>\n`,
  css: `:root {\n  color-scheme: dark;\n}\n\nbody {\n  font-family: sans-serif;\n}\n`
};

export function getInitialCode(language: SupportedLanguage = DEFAULT_LANGUAGE) {
  return templates[language];
}
