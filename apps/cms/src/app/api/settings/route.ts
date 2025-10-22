import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: 'default' },
    });

    // If settings don't exist, create default settings
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: 'default',
          siteNameEn: 'Mouhajer International Design',
          siteNameAr: 'مهاجر الدولية للتصميم',
          siteDescriptionEn: 'Premier luxury interior design company in Dubai, UAE',
          siteDescriptionAr: 'شركة التصميم الداخلي الفاخر الرائدة في دبي، الإمارات العربية المتحدة',
        },
      });
    }

    // Transform to match expected format
    const transformedSettings = {
      siteName: {
        en: settings.siteNameEn,
        ar: settings.siteNameAr,
      },
      siteDescription: {
        en: settings.siteDescriptionEn,
        ar: settings.siteDescriptionAr,
      },
      contactInfo: {
        email: settings.contactEmail,
        phone: settings.contactPhone,
        address: {
          en: settings.contactAddressEn,
          ar: settings.contactAddressAr,
        },
      },
      socialMedia: {
        facebook: settings.socialFacebook,
        instagram: settings.socialInstagram,
        twitter: settings.socialTwitter,
        linkedin: settings.socialLinkedin,
        youtube: settings.socialYoutube,
      },
      seo: {
        metaTitle: {
          en: settings.seoMetaTitleEn,
          ar: settings.seoMetaTitleAr,
        },
        metaDescription: {
          en: settings.seoMetaDescriptionEn,
          ar: settings.seoMetaDescriptionAr,
        },
        keywords: settings.seoKeywords,
      },
      appearance: {
        primaryColor: settings.primaryColor,
        logo: settings.logoUrl,
        favicon: settings.faviconUrl,
      },
      updatedAt: settings.updatedAt.toISOString(),
    };

    return NextResponse.json(transformedSettings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const updateData: any = {};
    if (body.siteName?.en) updateData.siteNameEn = body.siteName.en;
    if (body.siteName?.ar) updateData.siteNameAr = body.siteName.ar;
    if (body.siteDescription?.en) updateData.siteDescriptionEn = body.siteDescription.en;
    if (body.siteDescription?.ar) updateData.siteDescriptionAr = body.siteDescription.ar;
    if (body.contactInfo?.email !== undefined) updateData.contactEmail = body.contactInfo.email;
    if (body.contactInfo?.phone !== undefined) updateData.contactPhone = body.contactInfo.phone;
    if (body.contactInfo?.address?.en !== undefined) updateData.contactAddressEn = body.contactInfo.address.en;
    if (body.contactInfo?.address?.ar !== undefined) updateData.contactAddressAr = body.contactInfo.address.ar;
    if (body.socialMedia?.facebook !== undefined) updateData.socialFacebook = body.socialMedia.facebook;
    if (body.socialMedia?.instagram !== undefined) updateData.socialInstagram = body.socialMedia.instagram;
    if (body.socialMedia?.twitter !== undefined) updateData.socialTwitter = body.socialMedia.twitter;
    if (body.socialMedia?.linkedin !== undefined) updateData.socialLinkedin = body.socialMedia.linkedin;
    if (body.socialMedia?.youtube !== undefined) updateData.socialYoutube = body.socialMedia.youtube;
    if (body.seo?.metaTitle?.en !== undefined) updateData.seoMetaTitleEn = body.seo.metaTitle.en;
    if (body.seo?.metaTitle?.ar !== undefined) updateData.seoMetaTitleAr = body.seo.metaTitle.ar;
    if (body.seo?.metaDescription?.en !== undefined) updateData.seoMetaDescriptionEn = body.seo.metaDescription.en;
    if (body.seo?.metaDescription?.ar !== undefined) updateData.seoMetaDescriptionAr = body.seo.metaDescription.ar;
    if (body.seo?.keywords !== undefined) updateData.seoKeywords = body.seo.keywords;
    if (body.appearance?.primaryColor !== undefined) updateData.primaryColor = body.appearance.primaryColor;
    if (body.appearance?.logo !== undefined) updateData.logoUrl = body.appearance.logo;
    if (body.appearance?.favicon !== undefined) updateData.faviconUrl = body.appearance.favicon;

    const settings = await prisma.settings.upsert({
      where: { id: 'default' },
      update: updateData,
      create: {
        id: 'default',
        siteNameEn: body.siteName?.en || 'Mouhajer International Design',
        siteNameAr: body.siteName?.ar || 'مهاجر الدولية للتصميم',
        siteDescriptionEn: body.siteDescription?.en || '',
        siteDescriptionAr: body.siteDescription?.ar || '',
        ...updateData,
      },
    });

    // Transform to match expected format
    const transformedSettings = {
      siteName: {
        en: settings.siteNameEn,
        ar: settings.siteNameAr,
      },
      siteDescription: {
        en: settings.siteDescriptionEn,
        ar: settings.siteDescriptionAr,
      },
      contactInfo: {
        email: settings.contactEmail,
        phone: settings.contactPhone,
        address: {
          en: settings.contactAddressEn,
          ar: settings.contactAddressAr,
        },
      },
      socialMedia: {
        facebook: settings.socialFacebook,
        instagram: settings.socialInstagram,
        twitter: settings.socialTwitter,
        linkedin: settings.socialLinkedin,
        youtube: settings.socialYoutube,
      },
      seo: {
        metaTitle: {
          en: settings.seoMetaTitleEn,
          ar: settings.seoMetaTitleAr,
        },
        metaDescription: {
          en: settings.seoMetaDescriptionEn,
          ar: settings.seoMetaDescriptionAr,
        },
        keywords: settings.seoKeywords,
      },
      appearance: {
        primaryColor: settings.primaryColor,
        logo: settings.logoUrl,
        favicon: settings.faviconUrl,
      },
      updatedAt: settings.updatedAt.toISOString(),
    };

    return NextResponse.json(transformedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
