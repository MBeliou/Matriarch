export class LocalStorage<T> {
	private _key: string;
	content: T = $state(null!);

	constructor(key: string, placeholderValue: T) {
		this._key = key;

		const stored = localStorage.getItem(key);
		this.content = stored ? JSON.parse(stored) : placeholderValue;

		$effect(() => {
			localStorage.setItem(key, JSON.stringify(this.content));
		});
	}
}
