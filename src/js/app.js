import 'fg-loadcss/src/cssrelpreload.js'
import { Counter } from './counter'


(() => {
	// Register Service worker.
	if('serviceWorker' in navigator) {
		// Disable service worker because I can't dev like this!
		// navigator.serviceWorker.register('./sw.js').then(() => { })
	}
})()
