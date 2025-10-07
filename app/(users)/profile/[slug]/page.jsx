import { notFound, redirect } from 'next/navigation';
import ProfileComponent from '@/components/profile/profileComponent';
import { getAuthSession } from '@/lib/getAuthSession';

const Page = async ({ params }) => {
  const { slug } = await params;
  const session = await getAuthSession();

  if (!session || !session.user?.name) {
    redirect('/');
  }

  if (slug !== session.user.name) {
    notFound();
  }
//   console.log("hdgelktjdlkbjlckb",session.user)
  return <ProfileComponent session={session} />;
};

export default Page;