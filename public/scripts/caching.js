export function setCacheInformationWithExpiry(key, value, ttl) {
	const now = new Date();

	const item = {
		value: value,
		expiry: now.getTime() + ttl,
	};

	localStorage.setItem(key, JSON.stringify(item));
}

export function getCacheInformationWithExpiry(key) {
	const itemStr = localStorage.getItem(key);
	// if the item doesn't exist, return null
	if (!itemStr) {
		return null;
	}
	const item = JSON.parse(itemStr);
	const now = new Date();
	// compare the expiry time of the item with the current time
	if (now.getTime() > item.expiry) {
		// If the item is expired, delete the item from storage
		// and return null
		localStorage.removeItem(key);
		console.log("Cache information outdate, removing cache");
		return null;
	}
	return item.value;
}

export function setCacheForRegularSeason(key, data){
	localStorage.setItem(key, JSON.stringify(data));
}

export function getCacheForRegularSeason(key){
	const regularSeasonCache = localStorage.getItem(key);
	if(!regularSeasonCache){
		return null;
	}

	return JSON.parse(regularSeasonCache);
}