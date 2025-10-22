import { useEffect } from 'react';
import { metaTagsManager, MetaTagsConfig } from '../utils/metaTags';

export const useMetaTags = (config: MetaTagsConfig) => {
  useEffect(() => {
    metaTagsManager.updateMetaTags(config);
    
    // Cleanup function to reset meta tags when component unmounts
    return () => {
      metaTagsManager.resetToDefault();
    };
  }, [config.title, config.description, config.image, config.url]);
};

export const useArticleMetaTags = (article: {
  id: number;
  title: string;
  shortDescription: string;
  imageUrl?: string;
} | null) => {
  useEffect(() => {
    if (article) {
      metaTagsManager.updateForArticle(article);
    } else {
      metaTagsManager.resetToDefault();
    }
  }, [article]);
};