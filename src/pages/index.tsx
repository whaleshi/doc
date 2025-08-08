import type { ReactElement } from 'react';
import BaseLayout from '@/components/common/BaseLayout';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import HomeIndex from '@/components/home/Index';

function HomeLayout() {
  return (
    <>
      <HomeIndex />
    </>
  );
}


HomeLayout.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <div className='w-full mx-auto'>
        <BaseLayout>{page}</BaseLayout>
      </div>
    </>
  );
};

export default HomeLayout;