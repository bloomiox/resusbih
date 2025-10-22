// Meta tag management utility for dynamic Open Graph tags

export interface MetaTagsConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
}

class MetaTagsManager {
  private defaultConfig: MetaTagsConfig = {
    title: 'Udruženje Resuscitacijski savjet u Bosni i Hercegovini',
    description: 'Znanje koje spašava živote. Promicanje i unaprjeđenje znanja i vještina oživljavanja u Bosni i Hercegovini.',
    image: 'https://pub-7d86d5f2e97b46c0a2c2ed8485d9788b.r2.dev/RESUSBIH%20LOGO.png',
    url: window.location.origin,
    type: 'website',
    siteName: 'RESUSBIH'
  };

  private setMetaTag(property: string, content: string) {
    // Remove existing tag
    const existing = document.querySelector(`meta[property="${property}"]`) || 
                    document.querySelector(`meta[name="${property}"]`);
    if (existing) {
      existing.remove();
    }

    // Create new tag
    const meta = document.createElement('meta');
    if (property.startsWith('og:') || property.startsWith('twitter:')) {
      meta.setAttribute('property', property);
    } else {
      meta.setAttribute('name', property);
    }
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  }

  private setTitle(title: string) {
    document.title = title;
    this.setMetaTag('og:title', title);
    this.setMetaTag('twitter:title', title);
  }

  private setDescription(description: string) {
    this.setMetaTag('description', description);
    this.setMetaTag('og:description', description);
    this.setMetaTag('twitter:description', description);
  }

  private setImage(imageUrl: string) {
    this.setMetaTag('og:image', imageUrl);
    this.setMetaTag('og:image:secure_url', imageUrl);
    this.setMetaTag('twitter:image', imageUrl);
    this.setMetaTag('twitter:card', 'summary_large_image');
  }

  private setUrl(url: string) {
    this.setMetaTag('og:url', url);
    this.setMetaTag('twitter:url', url);
  }

  updateMetaTags(config: MetaTagsConfig) {
    const finalConfig = { ...this.defaultConfig, ...config };

    console.log('Updating meta tags:', finalConfig);

    // Update title
    if (finalConfig.title) {
      this.setTitle(finalConfig.title);
    }

    // Update description
    if (finalConfig.description) {
      this.setDescription(finalConfig.description);
    }

    // Update image
    if (finalConfig.image) {
      this.setImage(finalConfig.image);
    }

    // Update URL
    if (finalConfig.url) {
      this.setUrl(finalConfig.url);
    }

    // Set additional Open Graph tags
    if (finalConfig.type) {
      this.setMetaTag('og:type', finalConfig.type);
    }

    if (finalConfig.siteName) {
      this.setMetaTag('og:site_name', finalConfig.siteName);
    }

    // Set Twitter card type
    this.setMetaTag('twitter:card', 'summary_large_image');
  }

  resetToDefault() {
    this.updateMetaTags(this.defaultConfig);
  }

  // Generate article-specific meta tags
  updateForArticle(article: {
    id: number;
    title: string;
    shortDescription: string;
    imageUrl?: string;
  }) {
    const articleUrl = `${window.location.origin}/news?article=${article.id}`;
    
    this.updateMetaTags({
      title: `${article.title} | RESUSBIH`,
      description: article.shortDescription,
      image: article.imageUrl || this.defaultConfig.image,
      url: articleUrl,
      type: 'article'
    });
  }
}

export const metaTagsManager = new MetaTagsManager();

// Initialize default meta tags on load
export const initializeDefaultMetaTags = () => {
  metaTagsManager.resetToDefault();
};