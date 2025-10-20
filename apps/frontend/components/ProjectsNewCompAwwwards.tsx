'use client';
import Image from 'next/image';
import { PLACEHOLDER_IMAGE } from '@/lib/image-utils';
import React, { useRef, useEffect, useMemo, useState } from 'react';
import ProjectsearchbyLocationTab from './projectsearchbyLocationTab';
import { motion } from 'framer-motion';
import SearchProjectFiletr from './SearchProjectFiletr';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Props = {
  projects: any;
  searchParams?: string;
  filteredParams?: string;
};

const ProjectsNewCompAwwwards = ({ projects, searchParams, filteredParams }: Props) => {
  const router = useRouter();
  const locationsArr = useMemo(
    () =>
      projects
        ?.map((project: any) => (project.location || 'dubai').toLowerCase())
        .filter(Boolean)
        .filter((location: string, index: number, self: any) => self.indexOf(location) === index),
    [projects],
  );

  const titleRef = useRef<HTMLDivElement | null>(null);
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentTitle, setCurrentTitle] = useState<string>('Arto Cafe Dubai Mall');
  const [showSerachInput, setSHowSearchInput] = useState(false);
  const [location, setLocation] = useState<string>('Dubai');
  const [displayedProjects, setDisplayedProjects] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>(filteredParams || 'all');

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const titleElement = titleRef.current;
        if (titleElement) {
          const titleRect = titleElement.getBoundingClientRect();
          const titleCenter = titleRect.top + titleRect.height / 2;

          let newTitle = currentTitle;
          let newLocation = location;

          displayedProjects.forEach((project, index) => {
            const ref = boxRefs.current[index];
            if (ref) {
              const boxRect = ref.getBoundingClientRect();
              if (titleCenter >= boxRect.top && titleCenter <= boxRect.bottom) {
                newTitle = project.title?.en || project.title?.rendered || 'Project';
                newLocation = project.location || 'Dubai';
              }
            }
          });

          if (newTitle !== currentTitle) setCurrentTitle(newTitle);
          if (newLocation !== location) setLocation(newLocation);
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true } as any);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll as any);
  }, [displayedProjects, currentTitle, location]);

  // Filter projects whenever `searchParams` changes
  useEffect(() => {
    let next = projects;
    if (searchParams) {
      const q = searchParams.toLowerCase();
      next = next.filter((project: any) => project.title.rendered.toLowerCase().includes(q));
    }
    if (filteredParams) {
      const f = filteredParams.toLowerCase();
      next = next.filter((project: any) => project.acf?.type?.value?.toLowerCase?.().includes(f));
      setActiveFilter(f);
    } else {
      setActiveFilter('all');
    }
    setDisplayedProjects(next);
  }, [searchParams, projects, filteredParams]);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      router.push('/our-projects');
    } else {
      router.push(`/our-projects?filter=${filter}`);
    }
  };

  return (
    <div className="w-full container mx-auto lg:pt-12 pb-40 relative">
      {/* Accessible Title Overlay */}
      <div
        ref={titleRef}
        className="text-center fixed left-[50%] translate-x-[-50%] z-[1]"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="bg-black p-4 bg-opacity-70 rounded-lg shadow shadow-black lg:bg-transparent lg:shadow-none">
          <p className="text-lg font-SchnyderS text-white uppercase">{location}</p>
          <h2 className="lg:text-6xl text-2xl font-SchnyderS text-white">{currentTitle}</h2>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto overflow-hidden">
        {displayedProjects && displayedProjects.length > 0 ? (
          displayedProjects.map((project: any, index: number) => {
            const projectTitle = project.title?.rendered || 'Untitled Project';
            const projectType = project.acf?.type?.value || 'Interior Design';
            const projectLocation = project.acf?.location || 'Dubai';

            return (
              <motion.article
                initial={{
                  opacity: 0,
                }}
                whileInView={{
                  y: 0,
                  opacity: 1,
                }}
                transition={{
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
                key={project.slug || index}
                className={`flex flex-col lg:flex-row  relative z-[0] overflow-hidden
                ${index % 3 === 0 && 'lg:translate-x-[-10%] lg:w-[90%]'}
              ${index % 2 === 0 && 'lg:translate-x-[10%] lg:w-[100rem]'}


              ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  ref={(el) => (boxRefs.current[index] = el)}
                  className="lg:w-[24rem] h-72 relative mb-4 lg:mb-0"
                >
                  <Link
                    href={`/our-projects/${project.slug}`}
                    className="block w-full h-full group focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
                    aria-label={`View ${projectTitle} - ${projectType} project in ${projectLocation}`}
                  >
                    <Image
                      className="absolute w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      src={project.images?.[0] || PLACEHOLDER_IMAGE}
                      fill
                      alt={`${projectTitle} - ${projectType} interior design in ${projectLocation}`}
                      loading="lazy"
                      sizes="(max-width: 1024px) 100vw, 384px"
                    />
                  </Link>
                </div>
              </motion.article>
            );
          })
        ) : (
          <div className="text-center py-24">
            <p className="text-white text-xl">No projects found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Filter Navigation - Accessible */}
      <nav
        className="sticky z-[2] text-white w-full bottom-24 text-lg font-Satoshi uppercase drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] hidden lg:block"
        aria-label="Project filters"
      >
        <div className="w-full py-4 flex justify-between items-center relative">
          <div className={`${showSerachInput ? 'hidden' : ''}`}>
            <ProjectsearchbyLocationTab locations={locationsArr} />
          </div>

          <div
            className={`flex items-center bg-black px-4 bg-opacity-30 rounded-lg z-[9999] relative ${
              showSerachInput ? 'hidden' : ''
            }`}
            role="group"
            aria-label="Filter by project type"
          >
            <button
              onClick={() => handleFilterClick('all')}
              className={`py-2 pr-4 border-r cursor-pointer hover:opacity-80 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-inset rounded-l px-2 ${
                activeFilter === 'all' ? 'opacity-100 font-bold' : 'opacity-60'
              }`}
              aria-pressed={activeFilter === 'all'}
              aria-label="Show all projects"
            >
              All
            </button>

            <button
              onClick={() => handleFilterClick('residential')}
              className={`py-2 px-4 border-r cursor-pointer hover:opacity-80 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-inset ${
                activeFilter === 'residential' ? 'opacity-100 font-bold' : 'opacity-60'
              }`}
              aria-pressed={activeFilter === 'residential'}
              aria-label="Filter residential projects"
            >
              Residential
            </button>

            <button
              onClick={() => handleFilterClick('commercial')}
              className={`py-2 px-4 border-r cursor-pointer hover:opacity-80 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-inset ${
                activeFilter === 'commercial' ? 'opacity-100 font-bold' : 'opacity-60'
              }`}
              aria-pressed={activeFilter === 'commercial'}
              aria-label="Filter commercial projects"
            >
              Commercial
            </button>

            <button
              onClick={() => handleFilterClick('hotels')}
              className={`py-2 px-4 border-r cursor-pointer hover:opacity-80 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-inset ${
                activeFilter === 'hotels' ? 'opacity-100 font-bold' : 'opacity-60'
              }`}
              aria-pressed={activeFilter === 'hotels'}
              aria-label="Filter hotel projects"
            >
              Hotels
            </button>

            <button
              onClick={() => handleFilterClick('restaurants')}
              className={`py-2 px-4 cursor-pointer hover:opacity-80 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-inset rounded-r ${
                activeFilter === 'restaurants' ? 'opacity-100 font-bold' : 'opacity-60'
              }`}
              aria-pressed={activeFilter === 'restaurants'}
              aria-label="Filter restaurant projects"
            >
              Restaurants
            </button>
          </div>

          <SearchProjectFiletr
            showSerachInput={showSerachInput}
            setSHowSearchInput={setSHowSearchInput}
          />
        </div>
      </nav>
    </div>
  );
};

export default ProjectsNewCompAwwwards;
