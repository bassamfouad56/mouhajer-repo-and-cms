'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus('success');
        reset();
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: process.env.NEXT_PUBLIC_EMAIL || 'info@mouhajerdesign.com',
      href: `mailto:${process.env.NEXT_PUBLIC_EMAIL || 'info@mouhajerdesign.com'}`,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: process.env.NEXT_PUBLIC_PHONE || '+971-4-323-4567',
      href: `tel:${process.env.NEXT_PUBLIC_PHONE || '+971-4-323-4567'}`,
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Dubai, United Arab Emirates',
      href: '#',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-neutral-100 px-6 py-32 lg:px-12 lg:py-48"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:100px_100px]" />
      <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-purple-100/40 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Section Header */}
        <div className="mb-24 text-center lg:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-6 flex items-center justify-center gap-4"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-neutral-400" />
            <span className="text-sm font-light tracking-[0.3em] text-neutral-500">
              GET IN TOUCH
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-neutral-400" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6 text-5xl font-light tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl"
          >
            Start Your Project
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-neutral-600"
          >
            Ready to transform your space? Get in touch with our team to discuss
            your vision and discover how we can bring it to life.
          </motion.p>
        </div>

        <div className="grid gap-16 lg:grid-cols-5 lg:gap-24">
          {/* Left Column - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="rounded-sm bg-gradient-to-br from-neutral-950 to-neutral-900 p-10 lg:p-12">
              <h3 className="mb-8 text-2xl font-light text-white">Contact Information</h3>

              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="group flex items-start gap-5 rounded-sm border border-neutral-800/50 bg-neutral-900/30 p-6 transition-all hover:border-neutral-700 hover:bg-neutral-900/50"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-neutral-800 text-neutral-500 transition-all group-hover:border-white group-hover:text-white">
                      <item.icon size={20} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <div className="mb-2 text-xs font-light tracking-wider text-neutral-500">
                        {item.label}
                      </div>
                      <div className="text-lg font-light text-neutral-300 transition-colors group-hover:text-white">
                        {item.value}
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Business Hours */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-10 rounded-sm border border-neutral-800/50 bg-neutral-900/30 p-6"
              >
                <div className="mb-5 text-xs font-light tracking-wider text-neutral-500">
                  BUSINESS HOURS
                </div>
                <div className="space-y-3 text-sm font-light">
                  <div className="flex justify-between text-neutral-300">
                    <span>Monday - Friday</span>
                    <span className="text-neutral-500">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="h-px w-full bg-neutral-800/50" />
                  <div className="flex justify-between text-neutral-300">
                    <span>Saturday</span>
                    <span className="text-neutral-500">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="h-px w-full bg-neutral-800/50" />
                  <div className="flex justify-between text-neutral-600">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="rounded-sm bg-white p-10 shadow-2xl shadow-neutral-900/10 lg:p-12">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-3 block text-xs font-light tracking-wider text-neutral-500">
                      YOUR NAME *
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      placeholder="Enter your name"
                      className={`w-full border-b-2 ${errors.name ? 'border-red-500' : 'border-neutral-200'} bg-transparent px-0 py-4 text-base font-light text-neutral-950 placeholder:text-neutral-400 transition-all focus:border-neutral-950 focus:outline-none`}
                    />
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 flex items-center gap-1.5 text-xs text-red-600"
                      >
                        <span>⚠</span>
                        {errors.name.message}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label className="mb-3 block text-xs font-light tracking-wider text-neutral-500">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="Enter your email"
                      className={`w-full border-b-2 ${errors.email ? 'border-red-500' : 'border-neutral-200'} bg-transparent px-0 py-4 text-base font-light text-neutral-950 placeholder:text-neutral-400 transition-all focus:border-neutral-950 focus:outline-none`}
                    />
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 flex items-center gap-1.5 text-xs text-red-600"
                      >
                        <span>⚠</span>
                        {errors.email.message}
                      </motion.p>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-3 block text-xs font-light tracking-wider text-neutral-500">
                      PHONE NUMBER
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      placeholder="Enter your phone"
                      className="w-full border-b-2 border-neutral-200 bg-transparent px-0 py-4 text-base font-light text-neutral-950 placeholder:text-neutral-400 transition-all focus:border-neutral-950 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-xs font-light tracking-wider text-neutral-500">
                      SUBJECT *
                    </label>
                    <input
                      {...register('subject')}
                      type="text"
                      placeholder="Project subject"
                      className={`w-full border-b-2 ${errors.subject ? 'border-red-500' : 'border-neutral-200'} bg-transparent px-0 py-4 text-base font-light text-neutral-950 placeholder:text-neutral-400 transition-all focus:border-neutral-950 focus:outline-none`}
                    />
                    {errors.subject && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 flex items-center gap-1.5 text-xs text-red-600"
                      >
                        <span>⚠</span>
                        {errors.subject.message}
                      </motion.p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-xs font-light tracking-wider text-neutral-500">
                    YOUR MESSAGE *
                  </label>
                  <textarea
                    {...register('message')}
                    rows={6}
                    placeholder="Tell us about your project vision..."
                    className={`w-full resize-none border-b-2 ${errors.message ? 'border-red-500' : 'border-neutral-200'} bg-transparent px-0 py-4 text-base font-light leading-relaxed text-neutral-950 placeholder:text-neutral-400 transition-all focus:border-neutral-950 focus:outline-none`}
                  />
                  {errors.message && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-center gap-1.5 text-xs text-red-600"
                    >
                      <span>⚠</span>
                      {errors.message.message}
                    </motion.p>
                  )}
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full overflow-hidden border border-neutral-950 px-10 py-5 text-sm font-light tracking-widest text-neutral-950 transition-all hover:text-white disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 sm:w-auto"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                      <Send
                        size={18}
                        className="transition-transform group-hover:translate-x-2"
                      />
                    </span>
                    <div className="absolute inset-0 -translate-x-full bg-neutral-950 transition-transform duration-300 group-hover:translate-x-0" />
                  </button>

                  {submitStatus === 'success' && (
                    <p className="mt-4 text-sm font-light text-green-600">
                      ✓ Message sent successfully! We'll get back to you soon.
                    </p>
                  )}
                  {submitStatus === 'error' && (
                    <p className="mt-4 text-sm font-light text-red-600">
                      ✗ Failed to send message. Please try again or contact us directly.
                    </p>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
