export interface Post {
  _id: string;
  slug?: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags?: string[];
  author?: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
  description?: string;
}

export interface PostMatter {
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  author?: string;
}

export function markdownDocumentToPost(doc: any): Post {
  return {
    _id: doc._id,
    slug: doc.fileName.replace(/\.md$/, ''),
    title: doc.title,
    date: doc.createdAt,
    excerpt: doc.description || doc.content.substring(0, 200) + '...',
    content: doc.content,
    tags: doc.tags,
    author: doc.author || '',
    fileName: doc.fileName,
    fileSize: doc.fileSize,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    description: doc.description,
  };
}
