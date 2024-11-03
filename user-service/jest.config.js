module.exports = {
    testEnvironment: 'node', // Set the environment to Node.js
    testPathIgnorePatterns: ['/node_modules/'], // Ignore node_modules folder
    moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'], // File extensions to look for
    transform: {
      '^.+\\.js$': 'babel-jest', // If you're using Babel
    },
  };
  