export const CULTIVARS = {"WH": "IB0488 NEWTON", "MZ": "DEKALB 591", "SB": "M GROUP 2", "FA": "FALLOW"};

export const drainage_type = {
	"DR000": "No drainage",
	"DR001": "Ditches",
	"DR002": "Sub-surface tiles",
	"DR003": "Surface furrows"
};

//Fertilizer material code
export const FMCD = {
	"None": "None",
	"FE001": "Ammonium nitrate",
	"FE002": "Ammonium sulfate",
	"FE004": "Anhydrous ammonia",
	"FE005": "Urea",
	"FE006": "Diammnoium phosphate",
	"FE007": "Monoammonium phosphate",
	"FE010": "Urea ammonium nitrate solution"
};

export const FACD = {
	"AP001": "Broadcast, not incorporated", "AP002": "Broadcast, incorporated",
	"AP004": "Banded beneath surface", "AP009": "Injected"
};

export const defaultFertilizer = {
	"FDATE": "0402",
	// "FMCD": "FE004",
	"FACD": "AP009",
	"FDEP": "20",
	"FAMN": "193",
};

export const defaultPlanting = {
	// "PDATE":"0513",
	"PPOP":"8",
	"PPOE":"8",
	"PLME":"S",
	"PLDS":"R",
	"PLRS": "76",
	"PLRD": "0",
	"PLDP": "4"
};

export const defaultHarvest = {
	"HDATE" : "0928"
};

export const PLDS = {"R": "Row", "B": "Broadcast"};
export const TIMPL = {
	"None": "No Tillage", "TI002": "Subsoiler", "TI003": "Moldboard plow",
	"TI004": "Chisel plow, sweeps", "TI005": "Chisel plow, straight point", "TI006": "Chisel plow, twisted shovels",
	"TI007": "Disk plow", "TI008": "Disk, 1-way", "TI009": "Disk, tandem", "TI010": "Disk, double disk",
	"TI011": "Cultivator, field", "TI012": "Cultivator, row", "TI014": "Harrow, spike", "TI015": "Harrow, tine",
	"TI019": "Fertilizer applicator, anhydrous"
};

export const defaultTillage = {"TDATE": "0922", "TDEP": "15"};
// export const CROP = {"MZ": "Corn", "SB": "Soybean", "FA": "Fallow"};
export const cashCrops = ["Corn", "Soybean"];
export const coverCrops = ["Rye"];
export const cashCropOptions = cashCrops.concat(["None"]);
export const coverCropOptions = coverCrops.concat(["None"]);
export const defaultCropYears = ["2015", "2016", "2017", "2018", "2019"];
export const cultivars = {"Corn": "DEKALB 591", "Soybean":"M GROUP 2", "Rye": "IB0488 NEWTON", "None":"None"};
