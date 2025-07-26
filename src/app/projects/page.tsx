'use client';

import { useProjectsPage } from '@/shared/hooks/use-projects-page';
import { ProjectsPageView } from '@/tasia/components/projects/ProjectsPageView';

export default function ProjectsPage() {
    const pageProps = useProjectsPage();
    return <ProjectsPageView {...pageProps} />;
}
