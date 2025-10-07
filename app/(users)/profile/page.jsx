import { getAuthSession } from '@/lib/getAuthSession';
import { redirect } from 'next/navigation';

const Page = async () => {
  const session = await getAuthSession();

  if (!session || !session.user?.name) {
    redirect('/');
  }

  redirect(`/profile/${session.user.name}`);
};

export default Page;