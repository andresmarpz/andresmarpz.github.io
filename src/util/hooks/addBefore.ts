import { router } from '../../router';
import { hooks } from '../store';

export default function addBeforeHook(path: string, fn: () => boolean) {
    const { before } = hooks;
    if (before.includes(path)) return;

    before.push(path);
    router.addBeforeHook(path, (done: (bool?: boolean) => void) => {
		const next = fn();
		next ? done() : done(false);
	});	
}
