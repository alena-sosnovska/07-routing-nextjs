import NotesClient from './Notes.client';
import { fetchNotes } from '../../../../lib/api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Suspense } from 'react';
import Loader from '../../../loading';

type SlugProps = {
  params: Promise< {
    slug: string[];
  }>;
};

async function NotesPage({ params }: SlugProps) {
  const queryClient = new QueryClient();
  const {slug} = await params;
  const tag = slug[0];

  await queryClient.prefetchQuery({
    queryKey: ['notes', '', 1, tag],
    queryFn: () => fetchNotes('', 1, 12, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}

export default function Page({ params }: SlugProps) {
  return (
    <Suspense fallback={<Loader />}>
      <NotesPage params={params} />
    </Suspense>
  );
}
