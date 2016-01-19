# angular-apikeys
A Angular module with a service for holding your API keys

Copyright (c) Ronny Haase, 2016.
Licensed under The MIT License.
https://github.com/ronnyhaase/angular-apikeys

## Introduction
If you ever run into the problem of talking to a lot of APIs in your AngularJS SPA and needed a place to manage the API keys, this tiny, unfancy module with just one lonesome service **(backed by unit tests)** is for you!

It's also used as optional dependency by other modules and services implementing APIs, as a kind of registry:
One developer uses angular-apikeys to add all keys in his app, and different other services by different other devs all look up their unique ID at the angular-apikeys service when it is injected. *(More details follow)*

## HowTo

The module is "apikeys" and it just consists of the service "apiKeys", which has the methods `get(key)` and `set(key, value)`:

```javascript
angular.module('myApp', ['apikeys']);
angular.module('myApp').run(['apiKeys', function (apiKeys) {
	fetchMyApiKeySomehow.then(function() {
		apiKeys.set('googleGeocode', '1234567890');
	});
}]);

angular.module('myApp').factory('googleGeocode', ['apiKeys', function (apiKeys) {
	// ...
	$http({
		params: {
			key: apiKeys.get('googleGeocode')
		}
		// ...
	});
	// ...
	// ..
	// .
}]);
```

As I said: Its unfancy.
Both, key and value must be non-empty strings. That's it, the rest is up to you.

Since ApiKeys is a provider you can also use it in the configuration phase of AngularJS, e.g. to do crazy things with $httpProvider:

```javascript
angular.module('myOtherApp').config(function (apiKeysProvider) {
	// Same API
	apiKeysProvider.set('googlePlaces', '0987654321');
	apiKeysProvider.get('googlePlaces');
}).run(function (apiKeys) {
	// Already available for a long time...
	apiKeys.get('googlePlaces');
});
```

Things like read-only, more strict key/value validation or other crazy ideas may be added later, if necessary.

## Contributing
Please create an issue. If you add a pull request, try to respect my code style and assure the tests do pass, and extend them if necessary!
