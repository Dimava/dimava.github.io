# PoopJs
This library was made for simplifying making of userscripts

## Main features

#### Prototype extentions
 - `querySelector` and `querySelectorAll` are simplified into `q` and `qq` respectively. `qq` returns `Array` instead of NodeList.
 - 

#### Paginate
 - Made for simplification of pagination usage:
   - Binds "Next Page" to click of Mouse Wheel or right Alt
```ts
function paginate(data:{
	condition?: selector | (() => boolean), // to enable only on some pages
	prefetch?: selector | selector[], // to prefetch next page with link[rel=prefetch]
	click?: selector | selector[], // to click next page button
	doc?: selector | selector[], // to fetch next page document
	after?: selector | selector[], // to append next page contents
	replace?: selector | selector[], // to replace with next page contents
	pager?: selector | selector[]; // to search for `doc` link inside it and replace it

	start?: (this: Paginate) => void | Promise<void>; // to modify current document or for custom action
	modify?: (this: Paginate, doc: Document) => void | Promise<void>; // to modify doc before usage
	end?: (this: Paginate, doc: Document) => void | Promise<void>; //  to modify current document

	maxAge?: deltaTime; // to cache dynamic pages for a while (as `number` ms or as ``)
	cache?: deltaTime | true; // to cache static pages
	xml?: boolean; // to make `doc` use XMLHTTPRequest for sites with nad encoding
}): PoopJs.Paginate;
```

#### Entry Filterer
 - Made for filtering and sorting lists of titles
```ts
function PoopJs.EF(
	entrySelector: selector | (() => HTMLElement[]), // element selector
	enabled: boolean | 'soft' = 'soft', // forse-enable or default auto-enable-when-has-elements
): PoopJs.EntryFilterer;
class PoopJs.EntryFilterer<Data> {
	// parses entries for further information usage
	addParser(
		id: string,
		parser: (e: HTMLElement, d: Partial<Data>) => Partial<Data>,
	);
	// for making simple boolean filters like "is colored" or "is new"
	addFilter(
		id: string,
		filter: (d: Data, e: Element) => boolean,
		options: CommonOptions
	);
	// for filters like "over N pages"
	addVFilter<Value extends number | string>(
		id: string,
		filter: (v: Value, d: Data, e: Element) => boolean,
		options: {
			value: number | string, // default value, required to determine type
		} & CommonOptions
	);
	addSorter<Value extends number | string>(
		id: string,
		sorter: (d: Data, e: Element) => Value, // ordering function
		options: CommonOptions
	);
	// to sort with css (flex/grid) of via swapping elements
	orderMode: 'swap' | 'css' = 'css';
	addModifier(...a); // see sourses
	addPrefix(...a); // see sourses
	get _datas(): Data[]; // debug view visible-elements data
}
type CommonOptions = {
	mode: 'on' | 'off' = 'off', // to enable on start
	hidden: boolean = false, // to hide the button
	// see sources
}
```
#### Etc
```
type KeyCode = "A".."Z" | "0".."9" | ""
PoopJs.kds: Record<KeyCode>
```