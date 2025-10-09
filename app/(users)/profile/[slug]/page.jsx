import { notFound, redirect } from 'next/navigation';
import ProfileComponent from '@/components/profile/profileComponent';
import { getAuthSession } from '@/lib/getAuthSession';
import { Suspense } from 'react';
import Loading from '../loading';

const Page = async ({ params }) => {
  const { slug } = await params;
  const session = await getAuthSession();

  if (!session || !session.user?.username) {
    redirect('/');
  }

  if (slug !== session.user.username) {
    notFound();
  }
  return (<Suspense fallback={<Loading/>}> <ProfileComponent session={session} /></Suspense>);
};

export default Page;