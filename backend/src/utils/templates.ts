import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@codeshare/shared";

const templates: Record<SupportedLanguage, string> = {
  plaintext: ``,
  typescript: `function greet(name: string) {\n  return \`Hello, \${name}\`;\n}\n\nconsole.log(greet("CodeSyncUp"));\n`,
  javascript: `function greet(name) {\n  return \`Hello, \${name}\`;\n}\n\nconsole.log(greet("CodeSyncUp"));\n`,
  python: `def greet(name: str) -> str:\n    return f"Hello, {name}"\n\nprint(greet("CodeSyncUp"))\n`,
  java: `class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, CodeSyncUp");\n  }\n}\n`,
  cpp: `#include <iostream>\n\nint main() {\n  std::cout << "Hello, CodeSyncUp" << std::endl;\n  return 0;\n}\n`,
  go: `package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello, CodeSyncUp")\n}\n`,
  rust: `fn main() {\n    println!("Hello, CodeSyncUp");\n}\n`,
  json: `{\n  "message": "Hello, CodeSyncUp"\n}\n`,
  markdown: `# Welcome\n\nShare code instantly without signups.\n`,
  html: `<!doctype html>\n<html>\n  <head>\n    <title>CodeSyncUp</title>\n  </head>\n  <body>\n    <h1>Hello, CodeSyncUp</h1>\n  </body>\n</html>\n`,
  css: `:root {\n  color-scheme: dark;\n}\n\nbody {\n  font-family: sans-serif;\n}\n`
};

export function getInitialCode(language: SupportedLanguage = DEFAULT_LANGUAGE) {
  return templates[language];
}
