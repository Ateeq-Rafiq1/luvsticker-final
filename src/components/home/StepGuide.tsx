
const StepGuide = () => {
  const steps = [
    {
      id: 1,
      title: 'Select Your Material',
      description: 'Choose from vinyl, holographic, clear and more premium sticker materials.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      id: 2,
      title: 'Upload Your Design',
      description: 'Upload your artwork in JPG, PNG or SVG format. Our editor supports all common file types.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      )
    },
    {
      id: 3,
      title: 'Customize & Preview',
      description: 'Resize, position, and choose your sticker shape. See a live preview of your design.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )
    },
    {
      id: 4,
      title: 'Order & Enjoy!',
      description: "Complete your order and we'll print and ship your custom stickers straight to your door.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    }
  ];

  return (
    <section className="section-container">
      <h2 className="section-title">How It Works</h2>
      <p className="section-subtitle">Create your custom stickers in just four easy steps</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {steps.map((step) => (
          <div key={step.id} className="card group hover:-translate-y-2 duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-istickers-purple/10 text-istickers-purple mb-4 group-hover:bg-istickers-purple group-hover:text-white transition-colors">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">
                <span className="text-istickers-purple mr-1">{step.id}.</span> {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StepGuide;
