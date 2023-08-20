import { trpc } from '../utils/trpc';

export default function Test() {
  const { data } = trpc.hello.useQuery({ text: 'client' });

  if (data === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>{data.greeting}</p>
    </div>
  );
}

Test.disableStoreProvider = true;
