import { Suspense } from 'react';

import Loader from '@/app/loading';
import { fetchNoteById } from '@/lib/api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function NoteDetailPage({ params }: PageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ['note', id], queryFn: () => fetchNoteById(id) });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
}
export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<Loader />}>
      <NoteDetailPage params={params} />
    </Suspense>
  );
}
