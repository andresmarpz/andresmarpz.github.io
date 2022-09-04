import { router } from '../../router';
import { hooks } from '../store';

export default function addAfterHook(path: string, fn: () => void) {
    const { after } = hooks;
    if (after.includes(path)) return;

    after.push(path);
    router.addAfterHook(path, fn);
}
