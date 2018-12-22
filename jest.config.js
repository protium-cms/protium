module.exports = {
  projects: [
    {
      roots: ["packages/serve"],
      preset: 'ts-jest',
      testEnvironment: 'node',
      bail: true,
      verbose: true,
    },
    {
      roots: ["packages/web"],
      preset: 'ts-jest',
      testEnvironment: 'node',
      bail: true,
      verbose: true,
    }
  ],
}