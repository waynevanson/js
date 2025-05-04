/**
 * @type {import('lint-staged').Configuration}
 */
export default {
  "*.js,*.jsx,*.ts,*.tsx,*.json,*.yaml,*.yml": [
    "prettier --write",
    "eslint --fix",
  ],
}
