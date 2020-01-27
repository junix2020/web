import { mapTo } from 'rxjs/operators';
import { timer } from 'rxjs';
import { AreaDTO } from '../dto/area.dto';

export const getAreas = function (data: any[], page, perPage) {
   return timer(1000).pipe(mapTo(getData(data , page, perPage)));
}

export function getData(data: any[], page: number, perPage: number) {

   var cityList = [];
   var cityDTO = new AreaDTO;
   var total: number;
   if (data.length > 0) {
      total = data.length;
      data.map(c => {
         cityDTO.areaID = c.areaID;
         cityDTO.code = c.code;
         cityDTO.name = c.name;
         cityDTO.description = c.description;
         cityDTO.statusTypeID = c.statusTypeID;
         cityDTO.statusName = c.statusName;
         cityList.push(Object.assign({}, cityDTO))
      })
   }

   console.log('areas server');
   const merged = { sortBy: 'name', page, perPage };
   const offset = (merged.page - 1) * +merged.perPage;

   return {
      perPage: +merged.perPage,
      lastPage: Math.ceil(total / +merged.perPage),
      total: total,
      currentPage: merged.page,
      data: cityList
   };
}