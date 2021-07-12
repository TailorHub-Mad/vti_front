
module.exports = {
  locales: ['es'],
  defaultLocale: 'es',
  pages: {
    '*': ['common'],
  },

  loadLocaleFrom: (lang,ns) =>
  import(`./src/locales/${lang}/${ns}.json`).then((m) => m.default),}
