import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect root path to the courses selection page
  redirect('/courses');
}
