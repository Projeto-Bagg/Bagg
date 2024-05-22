import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CityEntity } from 'src/modules/cities/entities/city.entity';
import { CountryEntity } from 'src/modules/countries/entities/country.entity';
import { RegionEntity } from 'src/modules/regions/entities/region.entity';
import { CityRegionCountryDto } from 'src/modules/cities/dtos/city-region-country.dto';

type Place<T> = T & {
  id: number;
  latitude: number;
  longitude: number;
};

export type PlaceWithDistance<T> = T & {
  distance: number;
};

export interface PlacesDistanceComparedToId<T> {
  id: number;
  places: PlaceWithDistance<T>[];
}

@Injectable()
export class DistanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  private async getClosestPlaces<T>(
    allPlaces: Place<T>[],
    ids: number[],
    page = 1,
    count = 10,
    cacheKey?: string,
  ): Promise<PlacesDistanceComparedToId<PlaceWithDistance<Place<T>>>[]> {
    const chosenPlaces: Place<T>[] = ids
      .map((id) => allPlaces.find((place) => place.id == id))
      .filter((place) => place !== undefined) as Place<T>[];

    const lowestCount = (page - 1) * count + count;
    const lowestDistances: PlacesDistanceComparedToId<
      PlaceWithDistance<Place<T>>
    >[] = chosenPlaces.map((chosenPlace) => ({
      places: [],
      id: chosenPlace.id,
    }));

    allPlaces.forEach((place) => {
      chosenPlaces.forEach((chosenPlace: Place<T>) => {
        const distance = this.calculateDistance(
          place.latitude,
          place.longitude,
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
            ...place,
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
              ...place,
              distance,
            };
          }
        }
      });
    });

    const placesDistanceComparisonForEachId: PlacesDistanceComparedToId<
      PlaceWithDistance<Place<T>>
    >[] = await Promise.all(
      lowestDistances.map(async (placesDistanceComparison) => {
        const placeWithDistancesSorted = {
          ...placesDistanceComparison,
          places: placesDistanceComparison.places
            .sort((a, b) => a.distance - b.distance)
            .slice((page - 1) * count, (page - 1) * count + count),
        };
        if (cacheKey) {
          await this.cache.set(
            `${cacheKey}-${placesDistanceComparison.id}-${page}-${count}`,
            JSON.stringify(placeWithDistancesSorted),
          );
        }
        return placeWithDistancesSorted;
      }),
    );

    return placesDistanceComparisonForEachId;
  }

  async getClosestCountries(
    ids: number[],
    page = 1,
    count = 10,
  ): Promise<
    PlacesDistanceComparedToId<PlaceWithDistance<Place<CountryEntity>>>[]
  > {
    const countries = await this.prisma.country.findMany();
    return await this.getClosestPlaces<CountryEntity>(
      countries,
      ids,
      page,
      count,
    );
  }

  async getClosestRegions(
    ids: number[],
    page = 1,
    count = 10,
  ): Promise<
    PlacesDistanceComparedToId<PlaceWithDistance<Place<RegionEntity>>>[]
  > {
    const cachedValues = await this.getCachedValues<RegionEntity>(
      ids,
      page,
      count,
      'regions',
    );

    ids = ids.filter(
      (id) =>
        !cachedValues.map((cachedValue) => cachedValue?.id ?? -1).includes(id),
    );

    if (ids.length === 0) {
      return cachedValues;
    }

    const regions = await this.prisma.region.findMany({
      where: {
        cities: { some: {} },
      },
    });

    return await this.getClosestPlaces<RegionEntity>(
      regions,
      ids,
      page,
      count,
      'regions',
    );
  }

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

  async getClosestCities(
    ids: number[],
    page = 1,
    count = 10,
  ): Promise<
    PlacesDistanceComparedToId<PlaceWithDistance<Place<CityEntity>>>[]
  > {
    const cachedValues = await this.getCachedValues<CityEntity>(
      ids,
      page,
      count + 1,
      'cities',
    );

    ids = ids.filter(
      (id) =>
        !cachedValues.map((cachedValue) => cachedValue?.id ?? -1).includes(id),
    );

    if (ids.length === 0) {
      cachedValues.forEach((place) => place.places.shift()); // retirando primeiro elemento pois é a própria cidade
      return cachedValues;
    }

    const cities = await this.getCities(ids);
    const closesPlaces = await this.getClosestPlaces(
      cities,
      ids,
      page,
      count + 1,
      'cities',
    );
    closesPlaces.forEach((place) => place.places.shift()); // retirando primeiro elemento pois é a própria cidade

    return closesPlaces;
  }

  async getClosestCitiesWithRegions(
    ids: number[],
    page = 1,
    count = 10,
  ): Promise<
    PlacesDistanceComparedToId<PlaceWithDistance<Place<CityRegionCountryDto>>>[]
  > {
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
              region: region!,
            };
          }),
        ),
      })),
    );
  }

  private async getCachedValues<T>(
    ids: number[],
    page: number,
    count: number,
    cacheKey: string,
  ): Promise<PlacesDistanceComparedToId<PlaceWithDistance<Place<T>>>[]> {
    let cachedValues: (
      | PlacesDistanceComparedToId<PlaceWithDistance<Place<T>>>
      | undefined
    )[] = await Promise.all(
      ids.map(
        async (id) =>
          await this.cache.get<
            PlacesDistanceComparedToId<PlaceWithDistance<Place<T>>>
          >(`${cacheKey}-${id}-${page}-${count}`),
      ),
    );

    cachedValues = cachedValues.filter(
      (cachedValue) => cachedValue !== undefined,
    );

    return cachedValues as PlacesDistanceComparedToId<
      PlaceWithDistance<Place<T>>
    >[];
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
}
