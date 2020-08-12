import Keycloak from "keycloak-js";


const prodDomain = "covercrop.ncsa.illinois.edu";

const devConfig = {
	basePath: "/",
	fragilityServer: "",
	fragilityMappingServer: "",
	semanticServer: "",
	domain: "localhost",
	CLUapi: "http://localhost:5000/api",
	latestWeatherDate: "2019-12-31",
	defaultCenterLongLat: [-88.2, 40.14],
	defaultZoom: 10,
	coverCropTerminationOffsetDays: 14, // Cover crop termination = Cash crop planting + 14 days
	useCroplandDataLayer: true, // Use Cropland data layer to get crop rotation history
	keycloak: Keycloak("http://localhost:3000/keycloak.json"),
	geoServer: "https://fd-geoserver.ncsa.illinois.edu/geoserver/wms",
	hideDecompOutputs: false
};

const prodConfig = {
	basePath: "/covercrops/",
	fragilityServer: "",
	fragilityMappingServer: "",
	semanticServer: "",
	domain: ".ncsa.illinois.edu",
	CLUapi: "https://fd-api.ncsa.illinois.edu/covercrop/api",
	latestWeatherDate: "2019-12-31",
	defaultCenterLongLat: [-88.2, 40.14],
	defaultZoom: 10,
	coverCropTerminationOffsetDays: 14, // Cover crop termination = Cash crop planting + 14 days
	useCroplandDataLayer: true, // Use Cropland data layer to get crop rotation history
	keycloak: Keycloak(`https://${ prodDomain }/keycloak.json`),
	geoServer: "https://fd-geoserver.ncsa.illinois.edu/geoserver/wms",
	hideDecompOutputs: true
};

const config = getConfig();

function getConfig() {
	if (process.env.NODE_ENV === "production") {
		return prodConfig;
	} else {
		return devConfig;
	}
}

export default config;
