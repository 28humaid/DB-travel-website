import { getAuthSession } from '@/lib/getAuthSession';
import { redirect } from 'next/navigation';

const Page = async () => {
  const session = await getAuthSession();

  if (!session || !session.user?.username) {
    redirect('/');
  }

  redirect(`/profile/${session.user.username}`);
};

export default Page;