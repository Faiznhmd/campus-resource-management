'use client';

import FAQ from '../components/FAQ';
import Hero from '../components/Hero';
import RecentBookings from '../components/RecentBookings';
import Recommended from '../components/Recommended';
import Stats from '../components/Stat';
import Upcoming from '../components/Upcoming';

export default function DashboardHome() {
  return (
    <div>
      <Hero />
      <Stats />
      <RecentBookings />
      <Recommended />
      <Upcoming />
      <FAQ />
    </div>
  );
}
