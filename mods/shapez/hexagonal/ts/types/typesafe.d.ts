


interface ObjectConstructor {
	fromEntries<K extends string | number | symbol, V>(entries: readonly (readonly [K, V])[]): Record<K, V>;
}