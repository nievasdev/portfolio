import MeSectionCompact from '@/components/MeSectionCompact';
import WorksColumn from '@/components/WorksColumn';
import ProjectsColumn from '@/components/ProjectsColumn';
import { getWorks, getProjects } from '@/lib/data';
import timeCalculator from "@/components/timeCalculator";



export default async function Home() {
  // Get data at build time
  const works = await getWorks();
  const projects = await getProjects();
  const timeDifference = timeCalculator()

  return (
    <>

      {/* 3 Column Grid Layout */}
      <div className="home-grid">
        {/* Left Column - Works */}
        <div className="column column-fixed" id="works">
          <div className="column-header">
            <h2 className="text-4xl font-bold text-white mb-6">Works</h2>
          </div>
          <div className="column-content">
            <WorksColumn worksData={works} />
          </div>
        </div>

        {/* Center Column - ME */}
        <div className="column center-column" id="about">
          <div className="column-content">
            {/* ME Section */}
            <div className=" rounded-lg p-1">
              <div className="mb-4 text-center">
                <h1 className="text-4xl font-bold text-white mb-2">Mauro Nievas</h1>
                {/* Title */}
                <p className="text-lg md:text-xl lg:text-2xl text-center text-spacial-4-90 font-medium">
                    {timeDifference !== null && `Full Stack Developer +${timeDifference.years} years`}
                </p>
              </div>
              <MeSectionCompact />
            </div>
          </div>
        </div>

        {/* Right Column - Projects */}
        <div className="column column-fixed" id="projects">
          <div className="column-header">
            <h2 className="text-4xl font-bold text-white mb-6">Projects</h2>
          </div>
          <div className="column-content">
            <ProjectsColumn projectsData={projects} />
          </div>
        </div>
      </div>
    </>
  );
}
