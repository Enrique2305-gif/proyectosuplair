module.exports = {
    // Preset adecuado para proyectos de React

    // Transforma archivos JavaScript/TypeScript con Babel
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
      },
  
    // Mapea archivos SVG para manejarlos en las pruebas

    testEnvironment: 'jsdom',
    globals: {
        'jest': {
        useESM: true,
        },
    },
    // Extiende las expectativas para las pruebas
  
    // Agrega reporteros, por ejemplo, Jest JUnit
    reporters: [
      'default',
      [
        'jest-junit',
        {
          outputDirectory: './test-results',
          outputName: 'junit.xml',
        },
      ],
    ],
    setupFilesAfterEnv: ['@testing-library/jest-dom'],

    // ... otras configuraciones ...
  };
  