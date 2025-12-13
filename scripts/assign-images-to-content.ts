import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'r97logzc',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-11-21',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function assignImagesToContent() {
  console.log('🎨 Starting automatic image assignment...\n')

  try {
    // Step 1: Get all unused Sanity images
    console.log('📸 Fetching unused Sanity images...')
    const allImages = await client.fetch(`
      *[_type == "sanity.imageAsset"] | order(_createdAt desc) {
        _id,
        url,
        originalFilename
      }
    `)

    console.log(`   Found ${allImages.length} total images in Sanity\n`)

    // Step 2: Get awards without project images
    console.log('🏆 Finding awards without images...')
    const awardsWithoutImages = await client.fetch(`
      *[_type == "award" && !defined(projectImage) && !defined(project)] {
        _id,
        title,
        projectName
      }
    `)

    console.log(`   Found ${awardsWithoutImages.length} awards without images\n`)

    // Step 3: Assign random images to awards
    let assignedToAwards = 0
    for (const award of awardsWithoutImages.slice(0, Math.min(awardsWithoutImages.length, allImages.length))) {
      const randomImage = allImages[assignedToAwards]

      if (!randomImage) continue

      await client
        .patch(award._id)
        .set({
          projectImage: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: randomImage._id,
            },
          },
        })
        .commit()

      console.log(`   ✅ Assigned image to award: ${award.title}`)
      assignedToAwards++
    }

    // Step 4: Get projects without images
    console.log(`\n📁 Finding projects without images...`)
    const projectsWithoutImages = await client.fetch(`
      *[_type == "project" && !defined(images)] {
        _id,
        "title": title.en,
        slug
      }
    `)

    console.log(`   Found ${projectsWithoutImages.length} projects without images\n`)

    // Step 5: Assign images to projects (3-5 images per project)
    let imageIndex = assignedToAwards
    let assignedToProjects = 0

    for (const project of projectsWithoutImages) {
      const imageCount = Math.floor(Math.random() * 3) + 3 // 3-5 images
      const projectImages = []

      for (let i = 0; i < imageCount && imageIndex < allImages.length; i++) {
        projectImages.push({
          _type: 'image',
          _key: `image-${i}`,
          asset: {
            _type: 'reference',
            _ref: allImages[imageIndex]._id,
          },
        })
        imageIndex++
      }

      if (projectImages.length > 0) {
        await client
          .patch(project._id)
          .set({
            images: projectImages,
            mainImage: projectImages[0], // Set first image as main
          })
          .commit()

        console.log(`   ✅ Assigned ${projectImages.length} images to project: ${project.title}`)
        assignedToProjects++
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('📊 ASSIGNMENT SUMMARY')
    console.log('='.repeat(60))
    console.log(`✅ Awards updated: ${assignedToAwards}`)
    console.log(`✅ Projects updated: ${assignedToProjects}`)
    console.log(`📸 Total images assigned: ${imageIndex}`)
    console.log(`\n🎉 Image assignment complete!\n`)

  } catch (error) {
    console.error('❌ Error assigning images:', error)
    process.exit(1)
  }
}

assignImagesToContent()
