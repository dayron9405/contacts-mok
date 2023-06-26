import React from 'react';
import './App.scss';
import { Link, Outlet } from 'react-router-dom';

const App = () => {
  return (
    <div className="App">
      <div className='p-4 flex justify-center items-center fixed w-full bg-white'>
        <img src="/mok.png" alt="logo mok" width={80}/>
        <h1 className='mx-2 text-2xl font-semibold'>App de contactos</h1>
        <nav className='flex justify-center items-center no-underline'>
        <div className='mx-2'>
            <Link to={'contacts'}>Contactos</Link>
          </div>
          <div className='mx-2'>
            <Link to={'favorites'}>Favoritos</Link>
          </div>
        </nav>
      </div>
      <div className='py-24'>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
