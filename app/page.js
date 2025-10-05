"use client"

import { useState } from 'react';
import Navbar from "@/components/home/navbar"; // Fixed import path to match provided file
import HomeComponent from '@/components/home/homeComponent';
import AboutComponent from '@/components/about/aboutComponent';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <>
      <Navbar setCurrentPage={setCurrentPage} currentPage={currentPage} />
      {currentPage === 'home' && <HomeComponent/>}
      {currentPage === 'about' && <AboutComponent/>}
    </>
  );
}