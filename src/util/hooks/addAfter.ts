import { router } from "../../router";
import { hooks } from "../store";

export default function addAfterHook(path: string, fn: () => void){
	if(hooks.includes(path)) return;

	hooks.push(path);
	router.addAfterHook(path, fn);
}