interface ProjectWithId {
  id: string;
}

export const resolveProjectIds = <Project extends ProjectWithId>(
  projectIds: readonly string[],
  projects: readonly Project[],
  context: string
): Project[] =>
  projectIds.map((projectId) => {
    const project = projects.find((candidate) => candidate.id === projectId);

    if (!project) {
      throw new Error(`Missing project ID "${projectId}" in ${context}`);
    }

    return project;
  });
