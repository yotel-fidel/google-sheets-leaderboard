"use client"

import SalesInfo from './components/SalesInfo';
import Leaderboard from './components/Leaderboard';

export const dynamic = "force-dynamic";

export default function Page() {

  return (
    <main>
      {/* <SalesInfo /> */}
      <Leaderboard />
    </main>
  );
}
