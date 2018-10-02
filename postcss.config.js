module.exports = {
	sourceMap: true,
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {
    	autoprefixer: {
    		grid: true
  		},
      browsers: '> 1%'
    },
  	// 'cssnano': {
  	// 	preset: [ 'default', {
			// 	discardComments: {
			// 		removeAll: true
			// 	}
			// }]
  	// },
  },
};
