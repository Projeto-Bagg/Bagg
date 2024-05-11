import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { City, Country, Region } from '@prisma/client';

interface CityDelegate {
  findMany(): Promise<City[]>;
}

interface RegionDelegate {
  findMany(): Promise<Region[]>;
}

interface CountryDelegate {
  findMany(): Promise<Country[]>;
}

interface Place {
  id: number;
  latitude: number;
  longitude: number;
}

export interface PlaceWithDistance extends Place {
  distance: number;
}

@Injectable()
export class DistanceService {
  constructor(private readonly prisma: PrismaService) {}

  private async getClosestPlaces(
    ids: number[],
    model: CityDelegate | RegionDelegate | CountryDelegate,
    page = 1,
    count = 10,
  ) {
    const allPlaces: Place[] = await model.findMany();
    //mudar pro index == id dps no seed mas por enquanto gambiarra
    const chosenPlaces: Place[] = [];
    for (let i = 0; i < ids.length; i++) {
      for (let j = 0; j < 5; j++) {
        if (ids[i] == allPlaces[ids[i] - j].id) {
          chosenPlaces.push(allPlaces[ids[i] - j]);
          break;
        }
      }
    }

    if (chosenPlaces.length == 0) {
      return [];
    }
    const lowestCount = (page - 1) * count + count;
    const lowestDistances: {
      id: number;
      latitude: number;
      longitude: number;
      distance: number;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }[][] = chosenPlaces.map((_) => []);
    if (chosenPlaces) {
      allPlaces.forEach((city) => {
        chosenPlaces.forEach((chosenPlace: Place, index) => {
          //n faz sentido comparar com os outros ids pq a funcao so vai ser usada com mais de um id na hora de recomendar
          if (chosenPlaces.map((place) => place.id).includes(city.id))
            return false;
          const distance = this.calculateDistance(
            city.latitude,
            city.longitude,
            chosenPlace?.latitude,
            chosenPlace?.longitude,
          );
          if (lowestDistances[index].length < lowestCount) {
            lowestDistances[index].push({ ...city, distance });
          } else {
            const biggerBy: number[] = [];
            for (let i = 0; i < lowestCount; i++) {
              biggerBy.push(distance - lowestDistances[index][i].distance);
            }
            const lowestBiggerByValue = Math.min.apply(0, biggerBy);
            if (lowestBiggerByValue < 0) {
              lowestDistances[index][biggerBy.indexOf(lowestBiggerByValue)] = {
                ...city,
                distance,
              };
            }
          }
        });
      });

      return lowestDistances.map((lowestDistanceById) =>
        lowestDistanceById
          .sort((a, b) => a.distance - b.distance)
          .slice((page - 1) * count, (page - 1) * count + count),
      );
    }
    return [];
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const earthRadiusKm = 6371;

    const degToRad = (degrees: number) => {
      return (degrees * Math.PI) / 180;
    };

    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(lat1)) *
        Math.cos(degToRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadiusKm * c;
    return distance;
  }

  async getClosestCities(ids: number[], page = 1, count = 10) {
    return await this.getClosestPlaces(ids, this.prisma.city, page, count);
  }

  async getClosestRegions(ids: number[], page = 1, count = 10) {
    return await this.getClosestPlaces(ids, this.prisma.region, page, count);
  }

  async getClosestCountries(ids: number[], page = 1, count = 10) {
    return await this.getClosestPlaces(ids, this.prisma.country, page, count);
  }

  async getClosestCitiesWithRegions(ids: number[], page = 1, count = 10) {
    const citiesById = await this.getClosestCities(ids, page, count);

    return await Promise.all(
      citiesById.map(
        async (cities) =>
          await Promise.all(
            cities.map(async (city) => {
              const region = await this.prisma.region.findFirst({
                where: {
                  cities: {
                    some: {
                      id: city.id,
                    },
                  },
                },
                include: {
                  country: true,
                },
              });

              return {
                ...city,
                region,
              };
            }),
          ),
      ),
    );
  }
}
