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
    id: number,
    model: CityDelegate | RegionDelegate | CountryDelegate,
    page = 1,
    count = 10,
  ) {
    const allPlaces: Place[] = await model.findMany();
    //mudar pro index == id dps no seed mas por enquanto gambiarra
    let correctIndex = -1;
    for (let i = 0; i < 20; i++) {
      if (id == allPlaces[id - i].id) {
        correctIndex = id - i;
        break;
      }
    }
    if (!correctIndex) {
      return [];
    }
    const chosenPlace = allPlaces.splice(correctIndex, 1);
    const lowestDistances: {
      id: number;
      latitude: number;
      longitude: number;
      distance: number;
    }[] = [];
    if (chosenPlace) {
      allPlaces.forEach((city) => {
        const distance = this.calculateDistance(
          city.latitude,
          city.longitude,
          chosenPlace[0]?.latitude,
          chosenPlace[0]?.longitude,
        );
        if (lowestDistances.length <= (page - 1) * count + count) {
          lowestDistances.push({ ...city, distance });
        } else {
          const biggerBy: number[] = [];
          for (let i = 0; i < count; i++) {
            biggerBy.push(distance - lowestDistances[i].distance);
          }
          const lowestBiggerByValue = Math.min.apply(0, biggerBy);
          if (lowestBiggerByValue < 0) {
            lowestDistances[biggerBy.indexOf(lowestBiggerByValue)] = {
              ...city,
              distance,
            };
          }
        }
      });
      return lowestDistances;
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

  async getClosestCities(id: number, page = 1, count = 10) {
    const cities = await this.getClosestPlaces(
      id,
      this.prisma.city,
      page,
      count,
    );

    return await Promise.all(
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
    );
  }

  async getClosestRegions(id: number, page = 1, count = 10) {
    return await this.getClosestPlaces(id, this.prisma.region, page, count);
  }

  async getClosestCountries(id: number, page = 1, count = 10) {
    return await this.getClosestPlaces(id, this.prisma.country, page, count);
  }
}
