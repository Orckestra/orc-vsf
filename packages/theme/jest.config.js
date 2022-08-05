module.exports = {
  modulePathIgnorePatterns: ['tests/e2e/'],
  transform: {
    '^.+\\.(m)js$': 'babel-jest',
    '^.+\\.ts$': 'ts-jest'
  }
};
