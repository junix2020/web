export class AreaDTO {
	areaID: string;
	code: string;
	name: string;
	description: string;
	statusTypeID: string;
	statusName: string;
}

export function createArea(params: any) {
	return {
		areaID: params.areaID,
		code: params.code,
		name: params.name,
		description: params.description,
		statusTypeID: params.statusTypeID,
		statusName: params.statusName
	} as AreaDTO
}