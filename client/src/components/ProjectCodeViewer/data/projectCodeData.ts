import BASE_URL from '../../../api/config';

export interface ProjectCodeFile {
  path: string;
  language: "typescript" | "tsx" | "javascript" | "text";
  content: string;
}

export interface ProjectCodeTreeNode {
  name: string;
  type: "file" | "folder";
  path: string;
  language?: "typescript" | "tsx" | "javascript" | "text";
  content?: string;
  children?: ProjectCodeTreeNode[];
}

export interface ProjectCodeDefinition {
  id: string;
  name: string;
  description: string;
  files: ProjectCodeFile[];
  tree?: ProjectCodeTreeNode;
  tag?: string;
  codeLink?: string;
}

// Helper function to build tree from flat file paths
const buildFileTree = (files: ProjectCodeFile[]): ProjectCodeTreeNode => {
  const root: ProjectCodeTreeNode = {
    name: "root",
    type: "folder",
    path: "",
    children: []
  };

  files.forEach((file) => {
    const parts = file.path.split("/");
    let current = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const nodePath = parts.slice(0, index + 1).join("/");

      if (!current.children) {
        current.children = [];
      }

      let existing = current.children.find((child) => child.name === part);

      if (!existing) {
        existing = {
          name: part,
          type: isFile ? "file" : "folder",
          path: nodePath,
          ...(isFile && {
            language: file.language,
            content: file.content
          })
        };

        if (!isFile) {
          existing.children = [];
        }

        current.children.push(existing);
      }

      current = existing;
    });
  });

  return root;
};

// Convert project from API to ProjectCodeDefinition format
const convertApiProjectToCodeDefinition = (apiProject: any): ProjectCodeDefinition => {
  let files: ProjectCodeFile[] = [];

  // New format: project has files array from folder upload
  if (apiProject.files && Array.isArray(apiProject.files) && apiProject.files.length > 0) {
    files = apiProject.files.map((file: any) => ({
      path: file.path || file.name || "file",
      language: mapLanguageToCodeViewerFormat(file.language || "text"),
      content: file.content || ""
    }));
  }
  // Old format: code content field
  else if (apiProject.codeContent && apiProject.codeContent.trim()) {
    files = [{
      path: `${apiProject.title}.${getFileExtension(apiProject.programmingLanguage || 'javascript')}`,
      language: mapLanguageToCodeViewerFormat(apiProject.programmingLanguage || 'javascript'),
      content: apiProject.codeContent
    }];
  }
  // Fallback: create a README
  else {
    files = [{
      path: "README.md",
      language: "text",
      content: `# ${apiProject.title}\n\n${apiProject.description || ''}\n\nView code on GitHub: ${apiProject.codeLink || '#'}`
    }];
  }

  return {
    id: apiProject._id,
    name: apiProject.title,
    description: apiProject.description,
    files,
    tag: apiProject.tag,
    codeLink: apiProject.codeLink
  };
};

const getFileExtension = (language: string): string => {
  const extensions: Record<string, string> = {
    javascript: 'js',
    typescript: 'ts',
    jsx: 'jsx',
    tsx: 'tsx',
    python: 'py',
    java: 'java',
    cpp: 'cpp',
    csharp: 'cs',
    php: 'php',
    ruby: 'rb',
    go: 'go',
    rust: 'rs',
    sql: 'sql',
    html: 'html',
    css: 'css',
    json: 'json',
    yaml: 'yaml',
    markdown: 'md',
    bash: 'sh',
    dockerfile: 'dockerfile'
  };
  return extensions[language] || 'txt';
};

const mapLanguageToCodeViewerFormat = (language: string): "typescript" | "tsx" | "javascript" | "text" => {
  const languageMap: Record<string, "typescript" | "tsx" | "javascript" | "text"> = {
    javascript: 'javascript',
    typescript: 'typescript',
    jsx: 'javascript',
    tsx: 'tsx',
    python: 'text',
    java: 'text',
    cpp: 'text',
    csharp: 'text',
    php: 'text',
    ruby: 'text',
    go: 'text',
    rust: 'text',
    sql: 'text',
    html: 'text',
    css: 'text',
    json: 'text',
    yaml: 'text',
    markdown: 'text',
    bash: 'text',
    dockerfile: 'text'
  };
  return languageMap[language] || 'text';
};

let cachedProjects: ProjectCodeDefinition[] = [];
let cacheLoadedTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch projects from API
export const loadProjectsFromApi = async (): Promise<ProjectCodeDefinition[]> => {
  const now = Date.now();
  
  // Return cached projects if still valid
  if (cachedProjects.length > 0 && (now - cacheLoadedTime) < CACHE_DURATION) {
    return cachedProjects;
  }

  try {
    console.log('[ProjectCodeData] Fetching projects from', `${BASE_URL}/projects`);
    
    const response = await fetch(`${BASE_URL}/projects`);
    
    if (!response.ok) {
      console.error('[ProjectCodeData] API returned status:', response.status, response.statusText);
      const text = await response.text();
      console.error('[ProjectCodeData] Response body:', text.substring(0, 500));
      return [];
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      console.error('[ProjectCodeData] Invalid content type:', contentType);
      const text = await response.text();
      console.error('[ProjectCodeData] Response:', text.substring(0, 200));
      return [];
    }
    
    const data = await response.json();
    
    if (data.success && Array.isArray(data.data)) {
      cachedProjects = data.data.map(convertApiProjectToCodeDefinition);
      cacheLoadedTime = now;
      
      // Build trees for all projects
      cachedProjects.forEach((project) => {
        project.tree = buildFileTree(project.files);
      });
      
      console.log('[ProjectCodeData] Loaded', cachedProjects.length, 'projects');
      return cachedProjects;
    } else {
      console.error('[ProjectCodeData] Invalid response structure:', data);
      return [];
    }
  } catch (error) {
    console.error('[ProjectCodeData] Error fetching projects:', error);
    return [];
  }
};

// Get project from cache
export const getProjectCodeDefinition = async (id: string): Promise<ProjectCodeDefinition | undefined> => {
  // Ensure projects are loaded
  const projects = await loadProjectsFromApi();
  return projects.find((project) => project.id === id);
};

export const findFileInTree = (
  tree: ProjectCodeTreeNode | undefined,
  path: string
): ProjectCodeFile | undefined => {
  if (!tree) return undefined;

  const traverse = (node: ProjectCodeTreeNode): ProjectCodeFile | undefined => {
    if (node.path === path && node.type === "file") {
      return {
        path: node.path,
        language: node.language || "text",
        content: node.content || ""
      };
    }

    if (node.children) {
      for (const child of node.children) {
        const result = traverse(child);
        if (result) return result;
      }
    }

    return undefined;
  };

  return traverse(tree);
};



