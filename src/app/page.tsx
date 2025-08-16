import ResponsiveLayout from '@/components/ResponsiveLayout';
import { getWorks, getProjects } from '@/lib/data';

export default async function Home() {
  // Get data at build time
  const works = await getWorks();
  const projects = await getProjects();

  return <ResponsiveLayout works={works} projects={projects} />;
}
