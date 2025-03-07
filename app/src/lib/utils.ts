import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}


export function setupAutoScroll(containerId: string) {
	const container = document.getElementById(containerId);

	if (!container) {
		console.error(`Container with ID "${containerId}" not found.`);
		return;
	}

	// Create a MutationObserver to detect changes in the container
	const observer = new MutationObserver(() => {
		//container.scrollTop = container.scrollHeight;
		container.scrollTo({
			top: container.scrollHeight,
			behavior: 'smooth'
		});
	});

	// Start observing the container for changes
	observer.observe(container, {
		childList: true, // observe direct children
		subtree: true, // and lower descendants too
		characterData: true // observe changes to text content
	});

	return observer; // return the observer so it can be disconnected if needed
}