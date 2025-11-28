export interface CmsPhotoArray {
  data: CmsPhotoAttributes[]
}

export interface CmsPhotoAttributes {
  id: number
  name: string
  size: number
  width: number
  height: number
  url: string
  alternativeText: string
}

export interface CmsData<T> {
  data: T
}

export type BannerData = {
  title: string
  text: string
  cta: {
    id: number
    text: string
    link: string
  }
  image: {
    url: string
    alternativeText?: string
  }
}

export type BannerResponse<T extends string> = {
  data: {
    [K in T]: BannerData
  }
}

export type HeroData = BannerResponse<'hero'>
export type MarketingData = BannerResponse<'marketing'>

export type BlogPost = {
  title: string
  slug: string
  content: string
  featuredImage: {
    url: string
    alternativeText?: string
  }
  createdAt: string
}

export type BlogData = {
  data: BlogPost[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export type Collection = {
  id: number
  documentId: string
  title: string
  handle: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  image: CmsPhotoAttributes
  locale: string
  description: string
}

export type VariantColor = {
  id: number
  name: string
  type: {
    color?: string
    image?: {
      url: string
      alternativeText?: string
    }
  }
}

export type VariantColorData = {
  data: VariantColor[]
}

export type ContentAttributes = {
  id: number
  title: string
  text: string
  image: CmsPhotoAttributes
}

export type WhyUsAttributes = {
  id: number
  title: string
  tiles: ContentAttributes[]
}

export type AboutUs = {
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
  banner: CmsPhotoAttributes[]
  ourStory: ContentAttributes
  whyUs: WhyUsAttributes
  ourCraftsmanship: ContentAttributes
  numbers: Omit<ContentAttributes, 'Image'>[]
}

export type AboutUsData = {
  data: AboutUs
}

export type Question = {
  id: number
  title: string
  text: string
}

export type FAQSection = {
  id: number
  title: string
  questions: Question[]
  bookmark: string
}

export type FAQ = {
  faqSections: FAQSection[]
}

export type FAQData = {
  data: FAQ
}

export type ContentPage = {
  id: number
  documentId: string
  pageContent: string
}

export type ContentPageData = {
  data: ContentPage
}