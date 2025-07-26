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


export function getRandomColor(): { mainColor: string; lighterColor: string; filter: string;} {
    // Array of predefined colors and their lighter shades
    const colors = [
      {
        mainColor: '#B42318',
        lighterColor: '#FEE4E2',
        filter:
          'invert(70%) sepia(71%) saturate(3896%) hue-rotate(348deg) brightness(70%) contrast(101%)',
      }, // Example colors, you can add more
      {
        mainColor: '#1172CC',
        lighterColor: '#EDF6FF',
        filter:
          'invert(66%) sepia(85%) saturate(1393%) hue-rotate(189deg) brightness(97%) contrast(70%)',
      },
      {
        mainColor: '#FD6C9E',
        lighterColor: '#FBDFE8',
        filter:
          'invert(35%) sepia(7%) saturate(5902%) hue-rotate(300deg) brightness(102%) contrast(98%)',
      },
      {
        mainColor: '#98A2B3',
        lighterColor: '#F0F0F0',
        filter:
          'invert(30%) sepia(6%) saturate(736%) hue-rotate(179deg) brightness(88%) contrast(87%)',
      },
      {
        mainColor: '#9B8AFB',
        lighterColor: '#F0EDFF',
        filter:
          'invert(36%) sepia(17%) saturate(7014%) hue-rotate(213deg) brightness(103%) contrast(97%)',
      },
      {
        mainColor: '#32D583',
        lighterColor: '#DEF4E9',
        filter:
          'invert(30%) sepia(39%) saturate(814%) hue-rotate(95deg) brightness(97%) contrast(80%)',
      },
      {
        mainColor: '#FDB022',
        lighterColor: '#FFF2DA',
        filter:
          'invert(20%) sepia(19%) saturate(5028%) hue-rotate(340deg) brightness(101%) contrast(98%)',
      },
      {
        mainColor: '#B57EDC',
        lighterColor: '#EDDEF9',
        filter:
          'invert(43%) sepia(70%) saturate(867%) hue-rotate(219deg) brightness(91%) contrast(89%)',
      },

      // Add more colors here as needed
    ];

    // console.log(colors[0].filter)

    // Randomly select a color from the array
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }