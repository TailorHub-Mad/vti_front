const nextTranslate = require('next-translate');

module.exports = nextTranslate({
    eslint: {
        dirs: ['src'], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
      },
});
