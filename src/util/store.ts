interface AfterEntry{
	path: string;
	fn: () => void
}

interface HookStore{
	after: AfterEntry[],
	before: string[]
}

export const hooks: HookStore  = {
	after: [],
	before: []
}