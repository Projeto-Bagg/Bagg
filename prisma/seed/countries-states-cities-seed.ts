import { PrismaClient } from '@prisma/client';
import * as countriesStatesCities from './countries-states-cities.json';
import * as continents from './regions.json';

const prisma = new PrismaClient();

interface Country {
  id: number;
  name: string;
  capital: string;
  iso2: string;
  latitude: string;
  longitude: string;
  states: Region[];
  region_id: string;
}

interface Region {
  name: string;
  latitude: string;
  longitude: string;
  cities: City[];
}

interface Continent {
  id: number;
  name: string;
}

interface City {
  name: string;
  latitude: string;
  longitude: string;
}

async function main() {
  const start = new Date().getTime();

  await prisma.continent.deleteMany();
  await prisma.city.deleteMany();
  await prisma.region.deleteMany();
  await prisma.country.deleteMany();

  const continentsData = continents as Continent[];

  for (let i = 0; i < continents.length; i++) {
    await prisma.continent.create({
      data: {
        id: continentsData[i].id,
        name: continentsData[i].name,
      },
    });
  }

  const countriesStatesCitiesData = countriesStatesCities as Country[];

  for (let i = 0; i < countriesStatesCitiesData.length; i++) {
    const country = await prisma.country.create({
      data: {
        name: countriesStatesCitiesData[i].name,
        capital: countriesStatesCitiesData[i].capital,
        iso2: countriesStatesCitiesData[i].iso2,
        latitude: Number(countriesStatesCitiesData[i].latitude),
        longitude: Number(countriesStatesCitiesData[i].longitude),
        continent: {
          connect: {
            id: Number(countriesStatesCitiesData[i].region_id),
          },
        },
      },
    });

    for (let j = 0; j < countriesStatesCitiesData[i].states.length; j++) {
      await prisma.region.create({
        data: {
          name: countriesStatesCitiesData[i].states[j].name,
          latitude: Number(countriesStatesCitiesData[i].states[j].latitude),
          longitude: Number(countriesStatesCitiesData[i].states[j].longitude),
          country: {
            connect: {
              id: country.id,
            },
          },
          cities: {
            createMany: {
              data: countriesStatesCitiesData[i].states[j].cities.map(
                (city) => {
                  return {
                    name: city.name,
                    latitude: Number(city.latitude),
                    longitude: Number(city.longitude),
                  };
                },
              ),
            },
          },
        },
      });
    }
  }

  const end = new Date().getTime();

  console.log(end - start);

  console.log(200);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
