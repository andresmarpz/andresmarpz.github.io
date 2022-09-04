import { hooks } from '../store';

export default function addAfterHook(path: string, fn: () => void) {
    const { after } = hooks;
    if (after.find((hook) => hook.path === path)) return;

    after.push({ path, fn });
}
