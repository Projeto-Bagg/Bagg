interface CalculateFlightPrice {
  distanceInKm: number;
  outward: Date;
  adults: number;
  kids: number;
}

export const calculateFlightPrice = ({
  distanceInKm,
  outward,
  adults,
  kids,
}: CalculateFlightPrice) => {
  const minimumPrice = 149.99;

  const dateIntervalInDays = Math.floor(
    (outward.getTime() - new Date().setHours(23, 59)) / 86400000,
  );

  const dateAlg = 600 - dateIntervalInDays * 100;
  const dateTax = dateAlg > 0 ? dateAlg : 0;

  const price = +(minimumPrice + distanceInKm * 0.28 + dateTax).toFixed(2);

  const adultsPrice = {
    message: `${adults} ${adults > 1 ? 'Adultos' : 'Adulto'}`,

    amount: adults * price,
  };

  const kidsPrice = kids > 0 && {
    message: `${kids} ${kids > 1 ? 'Crianças' : 'Criança'}`,

    amount: +(kids * price * 0.85).toFixed(2),
  };

  return {
    pricePerAdult: price,
    pricePerKid: +(price * 0.85).toFixed(2),
    total: +(adultsPrice.amount + (kidsPrice.amount || 0)).toFixed(2),
    items: Object.values({ adultsPrice, kidsPrice }).filter(Boolean),
  };
};
