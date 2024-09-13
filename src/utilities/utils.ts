// // src/app/utils.ts
// import { Observable, Subscription } from 'rxjs';

// export function sanitizeData(data: any): any {
//   const clonedData = deepClone(data);

//   for (const key in clonedData) {
//     if (clonedData.hasOwnProperty(key)) {
//       if (
//         clonedData[key] instanceof Observable || 
//         clonedData[key] instanceof Subscription || 
//         typeof clonedData[key] === 'function'
//       ) {
//         delete clonedData[key];
//       }
//     }
//   }

//   return clonedData;
// }

// function deepClone(obj: any) {
//   if (obj === null || typeof obj !== 'object') {
//     return obj;
//   }

//   if (Array.isArray(obj)) {
//     return obj.map((item) => deepClone(item));
//   }

//   const clonedObj: any = {};
//   for (const key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       clonedObj[key] = deepClone(obj[key]);
//     }
//   }
//   return clonedObj;
// }
