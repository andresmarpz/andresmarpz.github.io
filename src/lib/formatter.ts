export function formatImagePath(path: string) {
	// Replace .png and .jpg with .webp
	return path.replace(/\.png|\.jpg/g, '.webp');
}