const fs = require("fs-extra");
const path = require("path");

const BUILD_DIR = "./build";
const STATIC_DIR = "./static";
const REGISTRY_FILENAME = "registry.json";

/**
 * @returns {Promise<{[id: string]: string}>}
 */
const getRegistry = () =>
	fs.readJson(path.join(STATIC_DIR, REGISTRY_FILENAME));

/**
 * @returns {Promise<Array<{id: string, link: string}>>}
 */
const getRegistryList = () =>
	getRegistry()
		.then((registry) => Object.entries(registry))
		.then((entries) => entries.map(([id, link]) => ({id, link})));

/**
 *
 * @param registryList {Array<{id: string, link: string}>}
 * @return Array<{pred: {id: string, link: string}, current: {id: string, link: string}, succ: {id: string, link: string}}>
 */
const attachNeighbours = (registryList) =>
	registryList.map(
		(entry, index) => ({
			pred: registryList[(index - 1 + registryList.length) % registryList.length],
			current: entry,
			succ: registryList[(index + 1) % registryList.length]
		})
	);

const getRedirectHtml = (dst) =>
`<!DOCTYPE html>
<html lang="en">
	<head>
		<title>bob's club</title>
		<meta http-equiv="refresh" content="0; url='${dst}'" />
		<script type="text/javascript">
			window.location.href = "${dst}";
		</script>
	</head>
	<body>
		<p>thank you for visiting <a href="/">bob's club</a>!</p>
		<p>if you're not redirected automatically, <a href="${dst}">click here</a></p>
	</body>
</html>
`

const writeRedirect = (src, dst) =>
	fs.outputFile(`${BUILD_DIR}/${src}`, getRedirectHtml(dst));

/**
 * @param ring {Array<{pred: {id: string, link: string}, current: {id: string, link: string}, succ: {id: string, link: string}}>}
 */
const writeRing = (ring) =>
	Promise.all(
		ring.flatMap(({pred, current, succ}) => [
				writeRedirect(`/${current.id}/pred/index.html`, `../../${pred.id}`),
				writeRedirect(`/${current.id}/succ/index.html`, `../../${succ.id}`),
				writeRedirect(`/${current.id}/index.html`, current.link),
			]
		)
	);

const cleanBuild = () =>
	fs.remove(BUILD_DIR);

const copyStaticFiles = () =>
	fs.copy(STATIC_DIR, BUILD_DIR);

const main = () =>
	cleanBuild()
		.then(copyStaticFiles)
		.then(getRegistryList)
		.then(attachNeighbours)
		.then(writeRing);

main()
	.catch(console.error)
	.finally(process.exit);
