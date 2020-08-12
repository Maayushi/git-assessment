export const datawolfURL = "https://fd-api.ncsa.illinois.edu/datawolf";

export const steps ={
	Weather_Converter: "456edbfe-74ee-4a56-ba31-3b2750c8e5fe",
	Output_Parser: "0e962d1d-f7fe-4b03-c868-a4658ee01cf8",
	Soil_Converter: "85e2930c-3a43-4de7-cd36-1996388cd6ad",
	DSSAT_Batch: "25122874-e3b4-4397-d684-1d02af096181",
	Generate_Exp: "29f2d544-6cee-4897-8b9a-318c70ca784a",
};

const parameters = {
	soilWithCoverCrop: "26bd9c56-10d5-4669-af6c-f56bc8d0e5d5", // LAW1501.SQX
	modelWithCoverCrop: "e96ec549-031f-4cef-8328-f4d8051773ec", // CH441169-cover.v46
	soilWithoutCoverCrop: "3690d7fb-eba5-48c7-bfbe-a792ff379fb4", // ILAO1501.SQX
	modelWithoutCoverCrop: "ff590fee-b691-42cd-9d8f-ed0205b72d21" // CH441169-nocover.v46
};

export const workflowId = "12101e88-4f50-4b3c-add7-930444fc6ba1";

export function getWithCoverCropExecutionRequest(id, lat, long, personId, weatherPattern, exp_dataset_id, json_dataset_id) {
	return {
		"workflowId": workflowId,
		"creatorId": personId,
		"title": id,
		"description":"WithCoverCrop",
		"parameters": {
			"584c8752-f818-4d02-8361-5af959342a94": lat,
			"e43cd911-2da8-4c95-a5e5-207583be9ce3": long,
			"b78a76f0-982b-4e37-cae4-6acfc753184a": lat,
			"be161213-0bf9-4377-809e-1c46c93c93dd": long,
			"b20babe8-1ce1-4d1c-8d1d-adca68262f7e": weatherPattern.charAt(0)
		},
		"datasets": {
			// With cover crop
			"97f2896a-fc67-4bd7-960b-d0308f5a2494": parameters.modelWithCoverCrop,
			"8ed7ba56-5145-4bd3-aec0-f5721b8e28b7": exp_dataset_id, // experiment file template
			"d03b2aa2-7156-42b5-f03a-522306f1ac5c": json_dataset_id
		}
	};
}

export function getWithoutCoverCropExecutionRequest (id, lat, long, personId, weatherPattern, exp_dataset_id, json_dataset_id) {
	return {
		"workflowId": workflowId,
		"creatorId": personId,
		"title": id,
		"description":"WithoutCoverCrop",
		"parameters": {
			"584c8752-f818-4d02-8361-5af959342a94": lat,
			"e43cd911-2da8-4c95-a5e5-207583be9ce3": long,
			"b78a76f0-982b-4e37-cae4-6acfc753184a": lat,
			"be161213-0bf9-4377-809e-1c46c93c93dd": long,
			"b20babe8-1ce1-4d1c-8d1d-adca68262f7e": weatherPattern.charAt(0)
		},
		"datasets": {
			// Without cover crop
			"97f2896a-fc67-4bd7-960b-d0308f5a2494": parameters.modelWithoutCoverCrop,
			"8ed7ba56-5145-4bd3-aec0-f5721b8e28b7": exp_dataset_id, // experiment file template
			"d03b2aa2-7156-42b5-f03a-522306f1ac5c": json_dataset_id
		}
	};
}

// the fist weather pattern is the Default.
export const weatherPatterns = ["Average", "Hot", "Cold", "Dry", "Wet"];
// Cover crops currently supported
export const coverCrops = [ {value: "Cereal-Rye", label: "Cereal Rye"}];

export const latId = "b78a76f0-982b-4e37-cae4-6acfc753184a";
export const lonId = "be161213-0bf9-4377-809e-1c46c93c93dd";
export const weatherId = "b20babe8-1ce1-4d1c-8d1d-adca68262f7e";
export const resultDatasetId = "8884b4be-07d8-4a70-a624-efcafd58ffb2";
export const userInputJSONDatasetID = "d03b2aa2-7156-42b5-f03a-522306f1ac5c";
export const eventPageSize = 6;
export const defaultExpDatasetID = "dd80f5be-76b9-4a57-ae34-7a8da2ccb7ec";
export const defaultExptxtDatasetID= "ff2f769f-edff-4b98-a1d9-b3a1d2f24e9a";
export const weatherDatasetId = "eee54906-3bac-4c5f-b49e-40c68eaf206e";


