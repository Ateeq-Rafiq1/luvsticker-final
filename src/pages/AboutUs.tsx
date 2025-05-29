
import React from "react";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, ChevronRight } from "lucide-react";

const AboutUs = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Luvstickers</title>
      </Helmet>
      <Layout>
        {/* Hero Section */}
        <div className="bg-istickers-orange text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">About Luvstickers</h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                Printing premium stickers since 2015, bringing your designs to life with quality and care.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            {/* Our Story */}
            <section className="mb-20">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                  <p className="text-lg text-gray-700 mb-6">
                    Founded in 2015, Luvstickers began with a simple mission: to create high-quality, 
                    custom stickers that help people express themselves and bring their creative ideas to life.
                  </p>
                  <p className="text-lg text-gray-700 mb-6">
                    What started as a small operation in our founder's garage has grown into a 
                    full-scale production facility with state-of-the-art printing technology and 
                    a team of passionate designers and craftspeople who share our commitment to quality.
                  </p>
                  <p className="text-lg text-gray-700">
                    Today, we serve thousands of customers around the world, from individual creators
                    to Fortune 500 companies, all looking for the perfect stickers to showcase their brand,
                    message, or artistic vision.
                  </p>
                </div>
                <div className="relative">
                  <div className="bg-gray-200 h-96 w-full rounded-lg overflow-hidden">
                    <img 
                      src="/story.jpg" 
                      alt="Luvstickers Founding Team" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-6 -left-6 bg-istickers-orange text-white py-4 px-8 rounded shadow-lg">
                    <p className="font-bold">Est. 2015</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Mission and Vision */}
            <section className="mb-20 bg-gray-50 p-12 rounded-2xl">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <h3 className="text-2xl font-bold mb-4 text-istickers-orange">Our Mission</h3>
                  <p className="text-lg text-gray-700">
                    "To provide exceptional quality custom stickers and decals that help individuals and 
                    businesses express their uniqueness while delivering outstanding customer service and 
                    maintaining eco-friendly practices."
                  </p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <h3 className="text-2xl font-bold mb-4 text-istickers-orange">Our Vision</h3>
                  <p className="text-lg text-gray-700">
                    "To be the world's most trusted source for high-quality custom stickers, known for 
                    our craftsmanship, customer care, and commitment to sustainable practices."
                  </p>
                </div>
              </div>
            </section>

            {/* Values */}
            <section className="mb-20">
              <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
              <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="bg-istickers-orange h-14 w-14 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Quality First</h3>
                    <p className="text-lg text-gray-700">
                      We never compromise on quality. Every sticker we produce undergoes rigorous 
                      quality control to ensure it meets our high standards.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="bg-istickers-orange h-14 w-14 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Customer Satisfaction</h3>
                    <p className="text-lg text-gray-700">
                      Your satisfaction is our priority. We're not happy until you're happy with your order.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="bg-istickers-orange h-14 w-14 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Environmental Responsibility</h3>
                    <p className="text-lg text-gray-700">
                      We're committed to minimizing our environmental impact through sustainable 
                      practices and eco-friendly material options.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="bg-istickers-orange h-14 w-14 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Innovation</h3>
                    <p className="text-lg text-gray-700">
                      We continuously explore new materials, techniques, and technologies to 
                      offer you the best sticker options available.
                    </p>
                  </div>
                </div>
              </div>
            </section>



            {/* What Sets Us Apart */}
            <section className="mb-20 bg-gray-50 p-12 rounded-2xl">
              <h2 className="text-3xl font-bold mb-12 text-center">What Sets Us Apart</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                  <div className="bg-istickers-orange/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-istickers-orange">
                      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/>
                      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/>
                      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-4">Premium Materials</h3>
                  <p className="text-gray-700">
                    We use only the highest quality vinyl and adhesives to ensure your stickers 
                    last for years, even in outdoor conditions.
                  </p>
                </div>
                
                <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                  <div className="bg-istickers-orange/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-istickers-orange">
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                      <path d="m9 12 2 2 4-4"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-4">Custom Design Support</h3>
                  <p className="text-gray-700">
                    Our in-house design team helps bring your ideas to life, whether you need 
                    minor adjustments or a complete design from scratch.
                  </p>
                </div>
                
                <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                  <div className="bg-istickers-orange/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-istickers-orange">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-4">Fast Turnaround</h3>
                  <p className="text-gray-700">
                    With our efficient production process, most orders ship within 48 hours, 
                    so you don't have to wait weeks for your custom stickers.
                  </p>
                </div>
              </div>
            </section>

            {/* Timeline */}
            <section className="mb-20">
              <h2 className="text-3xl font-bold mb-12 text-center">Our Journey</h2>
              
              <div className="space-y-12 relative before:absolute before:inset-0 before:left-[19px] md:before:left-1/2 md:before:ml-[-1px] before:h-full before:w-0.5 before:bg-gray-200">
                {[
                  { year: "2015", title: "Humble Beginnings", description: "Luvstickers was founded in Sarah's garage with a single cutting machine and a passion for quality stickers." },
                  { year: "2017", title: "First Office Space", description: "As demand grew, we moved into our first dedicated office and production space, expanding our team to 10 people." },
                  { year: "2019", title: "New Production Technology", description: "We invested in cutting-edge printing and cutting technology, allowing for more intricate designs and faster production." },
                  { year: "2021", title: "International Expansion", description: "We began shipping to international customers, reaching sticker enthusiasts around the globe." },
                  { year: "2023", title: "Sustainability Initiative", description: "We launched our eco-friendly materials option and committed to carbon-neutral shipping." },
                  { year: "Today", title: "Continuing to Grow", description: "We're constantly evolving, with new products and services to meet the needs of our creative customers." }
                ].map((event, index) => (
                  <div key={index} className={`relative flex flex-col md:flex-row gap-8 items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="flex-1 md:text-right">
                      <div className={`absolute left-0 md:left-1/2 mt-1.5 -ml-1.5 md:-ml-3.5 h-7 w-7 rounded-full border-4 border-istickers-orange bg-white z-10 ${index % 2 === 0 ? 'md:translate-x-0' : 'md:-translate-x-0'}`}></div>
                    </div>
                    <div className="flex-1">
                      <div className={`bg-white p-6 rounded-xl shadow-lg ${index % 2 === 0 ? 'md:mr-10' : 'md:ml-10'}`}>
                        <div className="inline-block px-4 py-2 bg-istickers-orange text-white text-sm font-bold rounded mb-2">
                          {event.year}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        <p className="text-gray-700">{event.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Call to Action */}
            <section className="bg-istickers-orange text-white p-12 rounded-2xl text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Create Your Custom Stickers?</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who've brought their designs to life with Luvstickers.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="bg-white text-istickers-orange hover:bg-gray-100">
                  <Link to="/catalog">Browse Our Products</Link>
                </Button>
                <Button asChild size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white/10">
                  <Link to="/contact">Contact Our Team</Link>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AboutUs;
