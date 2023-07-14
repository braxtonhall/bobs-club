const registry = require("./registry.json");

const isValidEntry = ([id, link]) => {
	try {
		new URL(link);
		return /^[a-zA-Z0-9-_@]+$/.test(id) && id.toUpperCase() !== "ID";
	} catch {
		return false;
	}
};

const invalidEntries = Object.entries(registry).filter((entry) => !isValidEntry(entry));

if (invalidEntries.length) {
	throw new Error(`Invalid entries detected: ${JSON.stringify(invalidEntries)}`);
}
