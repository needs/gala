import Image from 'next/image';
import { barDefault } from '../../../../lib/store';
import { PageProps } from '../../../_app';
import { GetServerSideProps } from 'next';

export default function Bar() {
  const bar = barDefault;

  const toEuro = (value: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);

  return (
    <div className="flex flex-col items-center justify-center gap-20 p-4">
      <h1 className="text-[4rem] font-bold mt-10">Prix Buvette</h1>

      <div className="flex flex-row gap-10 justify-evenly w-full">
        {Object.entries(bar).map(([category, items]) => (
          <div className="flex flex-col gap-2" key={category}>
            <h2 className="text-5xl font-bold border-b mb-10 pb-2">
              {category}
            </h2>
            {Object.entries(items).map(([item, prices]) => (
              <div
                className="flex flex-row gap-10 justify-between text-gray-700 text-[2rem]"
                key={item}
              >
                <h3 className="font-medium">{item} :</h3>
                <h3 className="font-medium">
                  {prices
                    .map((price) => (price === 0 ? 'Gratuit' : toEuro(price)))
                    .join(' / ')}
                </h3>
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="absolute bottom-52 left-52 text-gray-600">Vente d&apos;alcool interdite aux mineurs</p>
      <div className="absolute bottom-2 right-2">
        <Image src="/qrcode.svg" alt="QR code" width={350} height={350} />
      </div>
      <div className="absolute bottom-2 right-[370px]">
        <Image src="/arrow.png" alt="arrow" width={350} height={350} />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const galaUuid = context.query.uuid as string;
  return {
    props: {
      galaUuid,
    },
  };
};
