import React from "react";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden grid md:grid-cols-2">
        {/* Left Side */}
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-sm opacity-90">
          If you face any problem then feel free to contact us . Whether you’re an athlete, student, or just passionate about sports — we’re here to connect and collaborate. Reach out and let’s make an impact together!
          </p>
        </div>

        {/* Right Side (Form) */}
        <div className="p-8">
          <form className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text text-gray-700">Your Name</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text text-gray-700">Email</span>
              </label>
              <input
                type="email"
                placeholder="example@domain.com"
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text text-gray-700">Message</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                rows="4"
                placeholder="Write your message..."
              ></textarea>
            </div>

            <div>
              <button className="btn btn-primary w-full mt-4">Send Message</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
