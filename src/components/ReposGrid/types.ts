export interface RepoItem {
  name: string;
  description: string;
  link: string;
}

export interface ReposData {
  heading: string;
  text: string;
  repos: RepoItem[];
}

export interface ReposGridProps {
  data: ReposData;
}

export interface RepoGroupConfig {
  heading: string;
  text: string;
  repoNames: string[];
}

export interface DisplayRepoGroup {
  heading: string;
  text: string;
  repos: RepoItem[];
}
