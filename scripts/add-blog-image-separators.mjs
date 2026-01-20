import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'b6q28exv',
  dataset: 'mouhajer-db',
  apiVersion: '2024-11-21',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// Image separators to insert at specific positions in the blog content
const imageSeparators = [
  {
    // After "Triangle of Blame" section (after "Split Contract model" paragraph)
    afterKey: 'xtt7v', // "In the construction industry, we call this..."
    separator: {
      _type: 'imageSeparator',
      _key: 'img-sep-1',
      style: 'fullwidth',
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: 'image-00875fbc53c768f4e89849682871b1f4f2103fa2-5977x3985-jpg', // lobby image
        },
        alt: 'Luxury hotel lobby showcasing integrated design and construction excellence',
      },
      caption: {
        en: 'When design and construction work as one, the result speaks for itself.',
        ar: 'عندما يعمل التصميم والبناء كوحدة واحدة، تتحدث النتيجة عن نفسها.',
      },
      enableParallax: true,
    },
  },
  {
    // After "Why Traditional Model Fails" - before "The Solution"
    afterText: 'Your vision dies in the gap between the two contracts.',
    separator: {
      _type: 'imageSeparator',
      _key: 'img-sep-2',
      style: 'contained',
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: 'image-8d6d0cb810a0754244cfe67f5e86eb45403658d1-6985x4657-jpg', // villa image
        },
        alt: 'Park Hyatt Villa interior - precision craftsmanship',
      },
      caption: {
        en: 'Precision requires control over every detail—from design to delivery.',
        ar: 'الدقة تتطلب السيطرة على كل التفاصيل - من التصميم إلى التسليم.',
      },
      aspectRatio: '16/9',
    },
  },
  {
    // After "MIDC Turnkey Protocol" section
    afterText: 'We start procuring long-lead items',
    separator: {
      _type: 'imageSeparator',
      _key: 'img-sep-3',
      style: 'fullwidth',
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: 'image-10597507abac78f4e6f46796794d6b5be1629be5-5980x3987-jpg', // another lobby
        },
        alt: 'Seamless integration of architecture and interior finishes',
      },
      caption: {
        en: 'One signature. Total accountability. Zero excuses.',
        ar: 'توقيع واحد. مسؤولية كاملة. لا أعذار.',
      },
      enableParallax: true,
    },
  },
  {
    // After "The Cost of Cheap" section
    afterText: 'took 4 months longer',
    separator: {
      _type: 'imageSeparator',
      _key: 'img-sep-4',
      style: 'duo',
      imageLeft: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: 'image-9b758502b86228e56724e8a544c70ce6dfbdbe03-6986x4657-jpg', // villa 03
        },
        alt: 'Luxury villa living space with custom millwork',
      },
      imageRight: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: 'image-7f6ec99c7d2929bf8a7d032c6e88333d355a1472-6982x4655-jpg', // villa 04
        },
        alt: 'Custom joinery and furniture integration',
      },
      caption: {
        en: 'In-house manufacturing means immediate resolution—not project delays.',
        ar: 'التصنيع الداخلي يعني حلول فورية - ليس تأخيرات في المشروع.',
      },
    },
  },
  {
    // After quote "Luxury is about precision..."
    afterText: 'precision requires proximity',
    separator: {
      _type: 'imageSeparator',
      _key: 'img-sep-5',
      style: 'narrow',
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: 'image-19f78fde4520435b1c1bf34c0c457b7ae6d96a0d-6987x4658-jpg', // villa 13
        },
        alt: 'Eng. Maher Mouhajer vision - integrated luxury execution',
      },
      caption: {
        en: '— Eng. Maher Mouhajer, Founder of MIDC',
        ar: '— م. ماهر مهاجر، مؤسس MIDC',
      },
      aspectRatio: '4/3',
    },
  },
  {
    // After Case Study section
    afterText: 'produced by the same office',
    separator: {
      _type: 'imageSeparator',
      _key: 'img-sep-6',
      style: 'fullwidth',
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: 'image-19791b8c1a589811dbc5cb381a9701b2a00fd718-5980x3987-jpg', // lobby 76
        },
        alt: 'Address Boulevard VIP Suite - delivered ahead of schedule',
      },
      caption: {
        en: 'Address Boulevard VIP Suite: Delivered 2 weeks ahead of schedule. Zero conflict variations.',
        ar: 'جناح أدرس بوليفارد VIP: تم تسليمه قبل الموعد بأسبوعين. صفر تغييرات بسبب التضارب.',
      },
      enableParallax: true,
    },
  },
]

async function addImageSeparators() {
  console.log('🖼️  Adding image separators to blog post...\n')

  // Get the current post
  const post = await client.fetch(
    `*[_type == "post" && slug.current == "turnkey-vs-split-contract"][0]{_id, content}`
  )

  if (!post) {
    console.error('❌ Post not found!')
    return
  }

  console.log(`📄 Found post: ${post._id}`)
  console.log(`📝 Current content blocks: ${post.content?.length || 0}`)

  // Create new content array with image separators inserted
  const newContent = []
  let separatorsAdded = 0

  for (let i = 0; i < post.content.length; i++) {
    const block = post.content[i]
    newContent.push(block)

    // Check if we should insert a separator after this block
    for (const sepConfig of imageSeparators) {
      let shouldInsert = false

      // Match by block key
      if (sepConfig.afterKey && block._key === sepConfig.afterKey) {
        shouldInsert = true
      }

      // Match by text content
      if (sepConfig.afterText && block._type === 'block' && block.children) {
        const blockText = block.children.map((c) => c.text || '').join('')
        if (blockText.includes(sepConfig.afterText)) {
          shouldInsert = true
        }
      }

      if (shouldInsert) {
        // Check if separator not already added
        const alreadyExists = newContent.some(
          (b) => b._key === sepConfig.separator._key
        )
        if (!alreadyExists) {
          newContent.push(sepConfig.separator)
          separatorsAdded++
          console.log(`  ✅ Added ${sepConfig.separator.style} separator after: "${sepConfig.afterKey || sepConfig.afterText}"`)
        }
      }
    }
  }

  if (separatorsAdded === 0) {
    console.log('\n⚠️  No separators were added. Checking content structure...')
    // Debug: show first few block keys and texts
    post.content.slice(0, 10).forEach((block, i) => {
      if (block._type === 'block' && block.children) {
        const text = block.children.map((c) => c.text || '').join('').substring(0, 50)
        console.log(`  Block ${i}: key="${block._key}" text="${text}..."`)
      }
    })
    return
  }

  // Update the post
  console.log(`\n📤 Updating post with ${separatorsAdded} image separators...`)

  try {
    await client
      .patch(post._id)
      .set({ content: newContent })
      .commit()

    console.log('\n✅ Successfully added image separators!')
    console.log(`📊 New content blocks: ${newContent.length}`)
  } catch (error) {
    console.error('❌ Error updating post:', error.message)
  }
}

addImageSeparators()
