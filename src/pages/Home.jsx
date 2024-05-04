import React, { Suspense } from 'react';
import Header from '../components/Header';
import Spinner from '../components/Spinner';
import { Routes, Route } from 'react-router-dom';
import HomeContainer from '../containers/HomeContainer';
import CreateTemplate from './CreateTemplate';

const Home = () => {
  return (
    <div className='w-full flex flex-col items-center justify-center'>
      {/* header */}
      <Header />

      {/* custom routes */}
      <main className='w-full mt-5'>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path='*' element={<HomeContainer />} />
            <Route path='/template/create' element={<CreateTemplate/>} /> {/* Add this route */}
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default Home;
