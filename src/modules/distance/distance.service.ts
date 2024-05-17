import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CityEntity } from 'src/modules/cities/entities/city.entity';

interface Place {
  id: number;
  latitude: number;
  longitude: number;
}

export interface PlaceWithDistance extends Place {
  distance: number;
}

export interface PlacesDistanceComparedToId {
  id: number;
  places: PlaceWithDistance[];
}

@Injectable()
export class DistanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  private async getCities(citiesId: number[]): Promise<CityEntity[]> {
    const ids = (
      await this.prisma.region.findMany({
        where: { cities: { some: { id: { in: citiesId } } } },
        include: { cities: true },
      })
    ).map((region) => region.id);

    const closestRegionsIds = (
      await this.getClosestRegions(ids, 1, 10)
    ).flatMap((region) => region.places.map((place) => place.id));

    return await this.prisma.city.findMany({
      where: { regionId: { in: closestRegionsIds } },
    });
  }

  private async getClosestPlaces(
    allPlaces: Place[],
    ids: number[],
    page = 1,
    count = 10,
    caching = false,
  ): Promise<PlacesDistanceComparedToId[]> {
    //tratar muitos ids dps de algum jeito
    if (ids.length > 50) {
      ids = ids.slice(0, 50);
    }

    let cachedValues: (PlacesDistanceComparedToId | undefined)[] =
      await Promise.all(
        ids.map(
          async (id) =>
            await this.cache.get<PlacesDistanceComparedToId>(
              `${id.toString()}-${page}-${count}`,
            ),
        ),
      );

    cachedValues = cachedValues.filter(
      (cachedValue) => cachedValue != undefined,
    ) as PlacesDistanceComparedToId[];

    ids = ids.filter(
      (id) =>
        !cachedValues.map((cachedValue) => cachedValue?.id ?? -1).includes(id),
    );

    if (ids.length == 0) {
      return cachedValues as PlacesDistanceComparedToId[];
    }
    const chosenPlaces: Place[] = ids
      .map((id) => allPlaces.find((place) => place.id == id))
      .filter((place) => place != undefined) as Place[];

    const lowestCount = (page - 1) * count + count;
    const lowestDistances: PlacesDistanceComparedToId[] = chosenPlaces.map(
      (chosenPlace) => ({ places: [], id: chosenPlace.id }),
    );
    if (chosenPlaces.length > 0) {
      allPlaces.forEach((city) => {
        chosenPlaces.forEach((chosenPlace: Place) => {
          const distance = this.calculateDistance(
            city.latitude,
            city.longitude,
            chosenPlace.latitude,
            chosenPlace.longitude,
          );
          const places = lowestDistances.find(
            (lowestDistance) => lowestDistance.id == chosenPlace.id,
          )?.places;
          if (!places) {
            return false;
          }
          if (places.length < lowestCount) {
            places.push({
              ...city,
              distance,
            });
          } else {
            const biggerBy: number[] = [];
            for (let i = 0; i < lowestCount; i++) {
              biggerBy.push(distance - places[i].distance);
            }
            const lowestBiggerByValue = Math.min.apply(0, biggerBy);
            if (lowestBiggerByValue < 0) {
              places[biggerBy.indexOf(lowestBiggerByValue)] = {
                ...city,
                distance,
              };
            }
          }
        });
      });
      const placesDistanceComparisonForEachId: PlacesDistanceComparedToId[] =
        await Promise.all(
          lowestDistances.map(async (placesDistanceComparison) => {
            const placeWithDistancesSorted = {
              ...placesDistanceComparison,
              places: placesDistanceComparison.places
                .sort((a, b) => a.distance - b.distance)
                .slice((page - 1) * count, (page - 1) * count + count),
            };
            if (caching) {
              await this.cache.set(
                `${placesDistanceComparison.id.toString()}-${page}-${count}`,
                JSON.stringify(placeWithDistancesSorted),
              );
            }
            return placeWithDistancesSorted;
          }),
        );

      return [
        ...placesDistanceComparisonForEachId,
        ...(cachedValues as PlacesDistanceComparedToId[]),
      ];
    }
    return cachedValues as PlacesDistanceComparedToId[];
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

  async getClosestCountries(
    ids: number[],
    page = 1,
    count = 10,
  ): Promise<PlacesDistanceComparedToId[]> {
    const countries = await this.prisma.country.findMany();
    return await this.getClosestPlaces(countries, ids, page, count);
  }

  async getClosestRegions(
    ids: number[],
    page = 1,
    count = 10,
  ): Promise<PlacesDistanceComparedToId[]> {
    const regions = await this.prisma.region.findMany({
      where: {
        cities: { some: {} },
      },
    });

    return await this.getClosestPlaces(regions, ids, page, count);
  }

  async getClosestCities(
    ids: number[],
    page = 1,
    count = 10,
  ): Promise<PlacesDistanceComparedToId[]> {
    const cities = await this.getCities(ids);
    const closesPlaces = await this.getClosestPlaces(
      cities,
      ids,
      page,
      count + 1,
      true,
    );
    closesPlaces.forEach((place) => place.places.shift()); // retirando primeiro elemento pois é a própria cidade

    return closesPlaces;
  }

  async getClosestCitiesWithRegions(
    ids: number[],
    page = 1,
    count = 10,
  ): Promise<PlacesDistanceComparedToId[]> {
    const citiesById = await this.getClosestCities(ids, page, count);

    return await Promise.all(
      citiesById.map(async (cities) => ({
        id: cities.id,
        places: await Promise.all(
          cities.places.map(async (city) => {
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
      })),
    );
  }
}
