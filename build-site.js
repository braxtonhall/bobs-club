const fs = require("fs-extra");
const registry = require("./registry.json");

const BUILD_DIR = "./build";
const STATIC_DIR = "./static";
const TEMPLATE_DIR = "./templates";

/**
 * @return {Array<{id: string, link: string}>}
 */
const getRegistryList = () =>
	Object.entries(registry)
		.map(([id, link]) => ({id, link}))
		.filter(isValidEntry);

/**
 * @param entry {{id: string, link: string}}
 * @return {boolean}
 */
const isValidEntry = (entry) => {
	try {
		new URL(entry.link);
		return /^[a-zA-Z0-9-_@]+$/.test(entry.id);
	} catch {
		return false;
	}
};

/**
 * @param entry {{id: string, link: string}}
 * @return {string}
 */
const toListItem = (entry) => `<li><a href="${entry.link}">${entry.id}</a></li>`;

/**
 * @param registryList {Array<{id: string, link: string}>}
 * @return Array<{pred: {id: string, link: string}, current: {id: string, link: string}, succ: {id: string, link: string}}>
 */
const attachNeighbours = (registryList) =>
	registryList.map((entry, index) => ({
		pred: registryList[(index - 1 + registryList.length) % registryList.length],
		current: entry,
		succ: registryList[(index + 1) % registryList.length],
	}));

const getStaticRedirectHtml = (dst) => renderTemplate("redirect-static.html", {DST: dst});

const getRandomRedirectHtml = (entries) => renderTemplate("redirect-random.html", {ENTRIES: JSON.stringify(entries)});

/**
 *
 * @param name {string}
 * @param env {Record<string, string>}
 */
const renderTemplate = (name, env) =>
	fs
		.readFile(`${TEMPLATE_DIR}/${name}`)
		.then((buffer) => buffer.toString())
		.then((content) =>
			Object.entries(env).reduce((render, [key, value]) => render.replaceAll(`$${key}`, value), content),
		);

const writeStaticRedirect = (src, dst) =>
	getStaticRedirectHtml(dst).then((render) => fs.outputFile(`${BUILD_DIR}/${src}`, render));

const writeRandomRedirect = (src, entries) =>
	getRandomRedirectHtml(entries).then((render) => fs.outputFile(`${BUILD_DIR}/${src}`, render));

const writeDirectory = (src) =>
	renderTemplate("directory.html", {MEMBERS: getRegistryList().map(toListItem).join("\n")}).then((render) =>
		fs.outputFile(`${BUILD_DIR}/${src}`, render),
	);

/**
 * @param ring {Array<{pred: {id: string, link: string}, current: {id: string, link: string}, succ: {id: string, link: string}}>}
 */
const writeRing = (ring) =>
	Promise.all(
		ring.flatMap(({pred, current, succ}) => [
			writeStaticRedirect(`/site/${current.id}/pred/index.html`, `../../${pred.id}`),
			writeRandomRedirect(
				`/site/${current.id}/random/index.html`,
				getRegistryList().filter(({id}) => id !== current.id),
			),
			writeStaticRedirect(`/site/${current.id}/succ/index.html`, `../../${succ.id}`),
			writeStaticRedirect(`/site/${current.id}/index.html`, current.link),
		]),
	);

const cleanBuild = () => fs.remove(BUILD_DIR);

const copyStaticFiles = () => fs.copy(STATIC_DIR, BUILD_DIR);

const main = () =>
	cleanBuild()
		.then(copyStaticFiles)
		.then(() => writeRandomRedirect("/random/index.html", getRegistryList()))
		.then(() => writeDirectory("/directory/index.html"))
		.then(getRegistryList)
		.then(attachNeighbours)
		.then(writeRing);

main().catch(console.error).finally(process.exit);
