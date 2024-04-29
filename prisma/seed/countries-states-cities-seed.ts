// import { PrismaClient } from '@prisma/client';
// import * as json from './countries-states-cities.json';

// const prisma = new PrismaClient();

// interface Country {
//   id: number;
//   name: string;
//   capital: string;
//   iso2: string;
//   latitude: string;
//   longitude: string;
//   states: Region[];
// }

// interface Region {
//   name: string;
//   latitude: string;
//   longitude: string;
//   cities: City[];
//   stateCode: string;
//   type: string | null;
// }

// interface City {
//   name: string;
//   latitude: string;
//   longitude: string;
// }

// async function main() {
//   const start = new Date().getTime();

//   await prisma.city.deleteMany();
//   await prisma.region.deleteMany();
//   await prisma.country.deleteMany();

//   const data = json as Country[];

//   for (let i = 0; i < data.length; i++) {
//     const country = await prisma.country.create({
//       data: {
//         name: data[i].name,
//         capital: data[i].capital,
//         iso2: data[i].iso2,
//         latitude: Number(data[i].latitude),
//         longitude: Number(data[i].longitude),
//       },
//     });

//     for (let j = 0; j < data[i].states.length; j++) {
//       await prisma.region.create({
//         data: {
//           name: data[i].states[j].name,
//           latitude: Number(data[i].states[j].latitude),
//           longitude: Number(data[i].states[j].longitude),
//           stateCode: data[i].states[j]['state_code'],
//           type: data[i].states[j].type,
//           country: {
//             connect: {
//               id: country.id,
//             },
//           },
//           cities: {
//             createMany: {
//               data: data[i].states[j].cities.map((city) => {
//                 return {
//                   name: city.name,
//                   latitude: Number(city.latitude),
//                   longitude: Number(city.longitude),
//                 };
//               }),
//             },
//           },
//         },
//       });
//     }
//   }

//   const end = new Date().getTime();

//   console.log(end - start);

//   console.log(200);
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
