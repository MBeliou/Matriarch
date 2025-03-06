export class LocalStorage<T> {
	private _key: string;
	content: T | null = $state(null);

	constructor(key: string) {
		this._key = key;

		const stored = localStorage.getItem(key);
		this.content = stored ? JSON.parse(stored) : null;

		$effect(() => {
			localStorage.setItem(key, JSON.stringify(this.content));
		});
	}
}
