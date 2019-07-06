const presets = [
  [
    '@babel/preset-env',
    {
      targets: {
        chrome: '40',
      },
      useBuiltIns: 'usage',
    },
  ],
]

module.exports = { presets }